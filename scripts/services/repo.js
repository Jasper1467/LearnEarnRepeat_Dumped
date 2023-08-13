/** Could be replaced with local DB */
export class RepoService {
	async get (key, defaultValue) {
		return (localStorage[key] || defaultValue);
	}

	async set (key, value) {
		localStorage[key] = value;
	}

	async remove (key) {
		localStorage.removeItem(key);
	}

	async getBooleanValue(key, defaultValue) {
		const value = await this.get(key);
		return (value && value.toString().toLowerCase() === 'true') || defaultValue;
	}

	async incrementNumericValue(key, incrementBy = 1) {
		let value = Number(await this.get(key, 0));
		value += incrementBy;
		await this.set(key, value);
		return value;
	}

	async getObject (key, defaultValue) {
		let obj = defaultValue;
		try {
			JSON.parse(localStorage[key] || defaultValue);
		} catch (err) {
			console.warn(`RepoService cannot parse ${key} as JSON; value: ${localStorage[key]}`);
		}

		return obj;
	}

	async setObject (key, value) {
		localStorage[key] = JSON.stringify(value);
	}

	resetAll() {
		localStorage.clear();
	}
}
