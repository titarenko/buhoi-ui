const { combineReducers } = require('redux')

const defaultQuery = { filtering: { }, grouping: { }, sorting: { }, paging: { } }

module.exports = combineReducers({
	query,
	items,
	request,
	error,
})

function query (state = defaultQuery, action) {
	switch (action.type) {
		case 'LIST_SET_QUERY': return action.query ? { ...defaultQuery, ...action.query } : defaultQuery
		case 'LIST_SET_FILTER': return { ...state, filtering: { ...state.filtering, [action.field]: action.value } }
		case 'LIST_SET_GROUPING': return { ...state, grouping: { field: action.field } }
		case 'LIST_SET_SORTING': return { ...state, sorting: { field: action.field, direction: action.direction } }
		case 'LIST_SET_PAGE': return { ...state, paging: { ...state.paging, index: action.index } }
		case 'LIST_SET_PAGE_SIZE': return { ...state, paging: { ...state.paging, size: action.size } }
		default: return state
	}
}

function items (state = null, action) {
	switch (action.type) {
		case 'LIST_SET_QUERY':
		case 'LIST_INVALIDATE': return null
		case 'LIST_SET_FILTER':
		case 'LIST_SET_GROUPING':
		case 'LIST_SET_SORTING': return action.invalidate ? null : state
		case 'LIST_LOADING_STARTED': return null
		case 'LIST_LOADING_SUCCEEDED': return action.result
		case 'LIST_LOADING_FAILED':
		case 'LIST_LOADING_FORBIDDEN': return null
		default: return state
	}
}

function request (state = null, action) {
	switch (action.type) {
		case 'LIST_LOADING_STARTED': return action.request
		case 'LIST_LOADING_SUCCEEDED':
		case 'LIST_LOADING_FAILED':
		case 'LIST_LOADING_FORBIDDEN': return null
		default: return state
	}
}

function error (state = null, action) {
	switch (action.type) {
		case 'LIST_LOADING_STARTED':
		case 'LIST_LOADING_SUCCEEDED': return null
		case 'LIST_LOADING_FAILED': return action.error
		default: return state
	}
}