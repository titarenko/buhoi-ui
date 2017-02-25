module.exports = {
	builders: {
		list: require('./builders/list'),
	},
	appReducers: [],
	pageReducers: [
		require('./builders/list/reducer'),
	],
}