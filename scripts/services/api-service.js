import {kConsts} from '../constants/consts.js';
import {kRepoKeys} from '../constants/repo-keys.js';
import {kQuizType} from '../constants/quiz-types.js';
import {kEventKeys} from '../constants/event-keys.js';

const TIMEOUT = 5000;
const RELOGIN_URL = "/api/users/relogin";

export class ApiService {
    constructor(axios) {
        this.axios = axios;

        axios.defaults.baseURL = kConsts.baseUrl;
        // axios.defaults.headers.common['Content-Type'] = 'application/json';
        // axios.defaults.headers.common['x-ler-tag'] = 'lerlerler';
        axios.defaults.timeout = TIMEOUT;

        const self = this;

        function retryPolicy(axios) {
            return async function (err) {
                console.warn('RETRY POLICY');

                // Retry policy handling
                let {config, message} = err;
                if (!config || !config.retry) {
                	return Promise.reject(err);
                }
                // retry while Network timeout or Network Error or 401 (as the token would be renewed).
                if (!(message.includes('timeout') || message.includes('Network Error') || message.includes('401'))) {
                	return Promise.reject(err);
                }

                const token = await window.repo.get(kRepoKeys.AUTH_TOKEN);
                if (err?.response?.status === 401 && token && config.url !== RELOGIN_URL) {
                	await self.relogin();
                	const newToken = await window.repo.get(kRepoKeys.AUTH_TOKEN);
                	if (newToken) {
                		config.headers = config.headers || {};
                		config.headers['Authorization'] = newToken;
                	}
                }

                config.geniz2 = 1;
                config.retry -= 1;
                const delayRetryRequest = new Promise((resolve) => {
                    setTimeout(() => {
                        console.log('retry the request', config.url);
                        resolve();
                    }, config.retryDelay || 1000);
                });
                return delayRetryRequest.then(() => axios(config));
            }
        };

        axios.interceptors.response.use(response => response, retryPolicy(axios));
        axios.interceptors.request.use(async function (config) {
            // before request is sent
            config.headers['Content-Type'] = 'application/json';
            config.headers['x-ler-tag'] = 'lerlerler';

            const token = await window.repo.get(kRepoKeys.AUTH_TOKEN);
            if (token) {
                config.headers["Authorization"] = token;
            }

            return config;
        });

        this.lastPurchaseTime = null;
    }

    async getConfig(retryPolicy) {
        const config = {};
        const token = await window.repo.get(kRepoKeys.AUTH_TOKEN);
        // send the token even if it's expired - it's needed for relogin API
        config.headers = {};
        config.headers['Content-Type'] = 'application/json';
        config.headers['x-ler-tag'] = 'lerlerler';

        if (token) {
            config.headers["Authorization"] = token;
        }
        config.retry = retryPolicy?.retry || 3;
        config.retryDelay = retryPolicy?.retryDelay || 3000;
        return config;
    }

    async executeAxiosRequest(url, body, retryPolicy) {
        const config = await this.getConfig(retryPolicy);

        const source = this.axios.CancelToken.source();
        const timeout = setTimeout(() => {
            source.cancel();
        }, TIMEOUT);

        try {
            const response = body ? await this.axios.post(url, body, config) : await this.axios.get(url, config);
            clearTimeout(timeout);
            if (this.offline) {
                window.owEventBus.trigger(kEventKeys.APP_NETWORK_CHANGE, 'online');
                this.offline = false;
            }

            // DBG DEBUG FAKE LOADING TIMES
            // await new Promise((resolve) => setTimeout(resolve, 2000));

            return response;
        } catch (err) {
            // We are getting here AFTER retry-policy handling
            const token = await window.repo.get(kRepoKeys.AUTH_TOKEN);
            if (err?.response?.status === 401 && token && url !== RELOGIN_URL) {
                await this.relogin();
            }
            if (err?.code === 'ERR_NETWORK') {
                window.owEventBus.trigger(kEventKeys.APP_NETWORK_CHANGE, 'offline');
                this.offline = true;
            } else if (this.offline) {
                window.owEventBus.trigger(kEventKeys.APP_NETWORK_CHANGE, 'online');
                this.offline = false;
            }

            const errorString = JSON.stringify(err);
            const errorMessage = err?.response?.data?.errorMessage?.message || err?.response?.data?.errorMessage || err?.message || err?.errorMessage || err?.response?.data;
            console.error(`${url}: ${errorMessage} | JSON.stringify(err): ${errorString}`);
            return {errorMessage: errorMessage || errorString, data: err?.response?.data};
        }
    }

    async ping() {
        const config = await this.getConfig();
        const source = this.axios.CancelToken.source();
        const timeout = setTimeout(() => {
            source.cancel();
        }, TIMEOUT);
        try {
            const randomString = Math.random().toString(36).substring(2, 15);
            await this.axios.head(`/ping?a=${randomString}`, config);
            clearTimeout(timeout);
            return true;
        } catch (err) {
            return err?.code !== 'ERR_NETWORK';
        }
    }

    async get(url) {
        return this.executeAxiosRequest(url);
    }

    async post(url, body = {}) {
        return this.executeAxiosRequest(url, body);
    }

    async getHeartsStatus() {
        try {
            const response = await this.post('/api/questions');
            if (response.data) {
                return response.data;
            } else {
                console.log(`getHeartsStatus Error no response.data`, response);
                return null;
            }
        } catch (err) {
            console.log(`getHeartsStatus Error: ${JSON.stringify(err)}`);
            return null;
        }
    }

    async acceptChallenge(quizType) {
        try {
            let url = '';

            console.log(`API: acceptChallenge: quizType: ${quizType}`);

            switch (quizType) {
                case kQuizType.REGULAR:
                    url = '/api/questions';
                    break;
                case kQuizType.BONUS_FREE:
                    url = '/api/questions/bonus';
                    break;
                case kQuizType.BUY_LIVES:
                    url = '/api/questions/buy';
                    break;
            }
            const response = await this.post(url);
            if (response.data) {
                let quizQuestionObject = response.data;
                quizQuestionObject.option1 = quizQuestionObject.options['0'];
                quizQuestionObject.option2 = quizQuestionObject.options['1'];
                quizQuestionObject.option3 = quizQuestionObject.options['2'];
                quizQuestionObject.option4 = quizQuestionObject.options['3'];
                quizQuestionObject.timeLimitMs = quizQuestionObject.time;
                quizQuestionObject.timeLimitForPopularMs = quizQuestionObject.time;
                return quizQuestionObject;
            } else {
                console.log(`acceptChallenge Error: no response.data`, response);
                return null;
            }
        } catch (err) {
            console.log(`acceptChallenge Error: ${JSON.stringify(err)}`);
            return null;
        }
    }

    async verifyEmail(code) {
        const response = await this.post("/api/users/verify-email", {code});
        this.handleToken(response);
        return response;
    }

    handleToken(response) {
        if (response?.data?.token && response?.data?.expiresIn) {
            window.repo.set(kRepoKeys.AUTH_TOKEN, response.data.token);
            // assuming that the client and server clock are the same since if no token is available
            // me request will fail and won't update the global time delta and either way 401 will cause relogin
            window.repo.set(kRepoKeys.AUTH_EXPIRATION, response.data.expiresIn);
        } else if (!response.errorMessage) {
            response.errorMessage = "Token expected but wasn't found"
        }
    }

    async signupGuestUser(userId, machineId) {
        const response = await this.post('/users/signup', {userId: userId, machineId});
        this.handleToken(response);
        return response;
    }

    async loginGuestUser(userId, machineId) {
        const response = await this.post('/users/login', {userId: userId, machineId});
        this.handleToken(response);
        return response;
    }

    async relogin() {
        const response = await this.get(RELOGIN_URL);
        if (!(response?.data?.token && response?.data?.expiresIn)) {
            await window.repo.remove(kRepoKeys.AUTH_TOKEN);
            await window.repo.remove(kRepoKeys.AUTH_EXPIRATION);
        } else {
            this.handleToken(response);
        }

        return response;
    }

    async completeRegistration(email, username) {
        return await this.post("/api/users/complete-registration", {username, email});
    }

    async manualSignup(email, username) {
        const response = await this.post("/users/manual-signup", {username, email});
        this.handleToken(response);
        return response;
    }

    storeTempToken(response) {
        const token = response?.data?.token;
        if (token) {
            if (this.tempTokenTimeoutId) {
                clearTimeout(this.tempTokenTimeoutId);
                this.tempTokenTimeoutId = null;
            }
            this.tempToken = token;
            this.tempTokenTimeoutId = setTimeout(() => {
                this.tempToken = null;
            }, 2.5 * 60 * 1000);
        } else if (!response?.errorMessage) {
            response.errorMessage = "Failed to login";
        }
    }

    clearTempToken() {
        if (this.tempTokenTimeoutId) {
            clearTimeout(this.tempTokenTimeoutId);
            this.tempTokenTimeoutId = null;
        }
        this.tempToken = null;
    }

    async usernameLogin(username) {
        const response = await this.post('/users/username-login', {username});
        this.storeTempToken(response);
        return response;
    }

    async emailLogin(email) {
        const response = await this.post('/users/email-login', {email});
        this.storeTempToken(response);
        return response;
    }

    async completeLoginByVerifyingPinCode(code) {
        if (!this.tempToken) {
            return {errorMessage: "Pincode expired, send a new one"};
        }
        const response = await this.post(`/users/recover/${this.tempToken}`, {code});
        if (!response.errorMessage) {
            this.clearTempToken();
        }
        this.handleToken(response);
        return response;
    }

    async sendPopularAnswer(questionId, option) {
        try {
            const response = await this.post('/api/questions/answer2', {
                question: questionId,
                answer: option
            });
            return response.data;
        } catch (err) {
            console.log(`sendPopularAnswer Error: ${JSON.stringify(err)}`);
            return null;
        }
    }

    async sendAnswer(questionId, option, trigger) {
        try {
            const response = await this.post('/api/questions/answer1', {
                question: questionId,
                answer: option
            });
            return response.data;
        } catch (err) {
            console.log(`sendAnswer Error: ${JSON.stringify(err)}`);
            return null;
        }
    }

    async getMe() {
        try {
            const response = await this.get('/api/users/me');
            console.log(response);
            return response.data;
        } catch (err) {
            console.log(`getMe Error: ${JSON.stringify(err)}`);
            return null;
        }
    }

    async getMyTicketsCount() {
        const response = await this.get('/api/users/ticketCount');
        return response.data;
    }

    async collectReward(qId) {
        try {
            const response = await this.post(`/api/questions/${qId}/claim`, {});
            return response.data;
        } catch (err) {
            console.log(`collectReward Error: ${JSON.stringify(err)}`);
            return null;
        }
    }

    async getPendingRewards() {
        try {
            const response = await this.get('/api/questions/pending');
            return response.data;
        } catch (err) {
            console.log(`getPendingRewards Error: ${JSON.stringify(err)}`);
            return null;
        }
    }

    async getRaffles() {
        let url = '/public/raffles.js';
        if (this.lastPurchaseTime && (new Date().getTime() - this.lastPurchaseTime < 60 * 1000)) {
            url += `?lut=${this.lastPurchaseTime}`;
        }
        const response = await this.get(url);
        return response.data;
    }

    async getFaq() {
        let url = '/public/faq.js';
        const response = await this.get(url);
        return response.data;
    }

    async claimRaffleReward(ticketId, name, email) {
        return await this.post(`/api/raffles/${ticketId}/claim`, {
            claimInfo: {
                name,
                email,
            }
        });
    }

    async getStore() {
        const response = await this.get('/public/store.js');
        return response.data;
    }

    async getVars() {
        const response = await this.get('/public/v.js');
        return response?.data?.vars;
    }

    async buyStoreItem(itemId, expectedPrice) {
        this.lastPurchaseTime = new Date().getTime();
        return await this.post(`/api/store/${itemId}/buy`, { expectedPrice });
    }
}
