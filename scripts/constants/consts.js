let debugExtraTime = 0;
// if (isDevelopment) {
// debugExtraTime = 5 * 60 * 1000;
// }
export const kConsts = {
    // baseUrl: 'http://localhost:5757',
    // baseUrl: 'https://mvc-ler-test.herokuapp.com',
    baseUrl: 'https://brain.learnearnrepeat.com',
    durationMs: {
        suggestion: 60 * 1000 + debugExtraTime, // Suggestion prompt duration
        beforeStep2: 0.75 * 1000, // Showing selected item
        step2: 4 * 1000, // Correct answer
        step4: 10 * 1000 + debugExtraTime, // Last step when reported popular guess
    },
};
