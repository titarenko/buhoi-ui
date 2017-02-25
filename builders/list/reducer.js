const set = require('lodash.set')

const registry = {
	'LIST_SET_QUERY': setQuery,
	'LIST_SET_FILTER': canCauseInvalidation(setFilter),
	'LIST_SET_GROUPING': canCauseInvalidation(setGrouping),
	'LIST_SET_SORTING': canCauseInvalidation(setSorting),
	'LIST_SET_PAGE': canCauseInvalidation(setPage),
	'LIST_SET_PAGE_SIZE': canCauseInvalidation(setPageSize),
	'LIST_LOADING_STARTED': setLoading,
	'LIST_LOADING_SUCCEEDED': setItems,
	'LIST_LOADING_FAILED': setFailure,
	'LIST_LOADING_ABORTED': setUnexpectedFailure,
	'LIST_INVALIDATE': invalidate,
}

module.exports = function (state, action) {
	const handler = registry[action.type]
	if (handler) {
		return handler(state, action)
	}
}

function setQuery (state, { query }) {
	return { ...state, query }
}

function setFilter (state, { field, value }) {
	return set({ ...state }, `query.filtering.${field}`, value)
}

function setGrouping (state, { field }) {
	return set({ ...state }, 'query.grouping.field', field)
}

function setSorting (state, { field, direction }) {
	return set({ ...state }, 'query.sorting', { field, direction })
}

function setPage (state, { index }) {
	return set({ ...state }, 'query.paging.index', index)
}

function setPageSize (state, { size }) {
	return set({ ...state }, 'query.paging.size', size)
}

function setLoading (state) {
	return { ...state, loading: true }
}

function setItems (state, { items }) {
	return { ...state, items, loading: false }
}

function setFailure (state, { reason }) {
	return { ...state, loadingError: reason, loading: false }
}

function setUnexpectedFailure(state, { error }) {
	return { ...state, loadingError: error.message, loading: false }
}

function invalidate (state) {
	return { ...state, items: null }
}

function canCauseInvalidation (handler) {
	return function (state, action) {
		const result = handler(state, action)
		return action.invalidateList
			? set(result, 'items', null)
			: result
	}
}