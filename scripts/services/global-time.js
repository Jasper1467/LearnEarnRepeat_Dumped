var getGlobalTime = () => {
	let t = Date.now();
	if (window.clock && window.clock.delta) {
		t += window.clock.delta;
	}
	return t;
};
window.getGlobalTime = getGlobalTime;

export default getGlobalTime;
