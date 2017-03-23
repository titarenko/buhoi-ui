const { combineReducers } = require('buhoi-client')

module.exports = combineReducers({
	query: queryReducer,
	selectedItem: selectedItemsReducer,
	suggestedItems: suggestedItemsReducer,
	selectedSuggestionIndex: selectedSuggestionIndexReducer,
})


function queryReducer (state = '', action) {
	switch (action.type) {
		case 'SELECTFILTER_SUGGESTION_STARTED': return action.query
		default: return state
	}
}

function selectedItemsReducer (state = null, action) {
	switch (action.type) {
		case 'SELECTFILTER_ADD': return action.item
		default: return state
	}
}

function suggestedItemsReducer (state = null, action) {
	switch (action.type) {
		case 'SELECTFILTER_SUGGESTION_STARTED': return null
		case 'SELECTFILTER_SUGGESTION_SUCCEEDED': return action.items
		case 'SELECTFILTER_SUGGESTION_FAILED':
		case 'SELECTFILTER_SUGGESTION_ABORTED': return null
		case 'SELECTFILTER_FINISH_SUGGESTION': return null
		default: return state
	}
}

function selectedSuggestionIndexReducer (state = null, action) {
	switch (action.type) {
		case 'SELECTFILTER_SUGGESTION_STARTED': return null
		case 'SELECTFILTER_SUGGESTION_SUCCEEDED': return 0
		case 'SELECTFILTER_SUGGESTION_FAILED':
		case 'SELECTFILTER_SUGGESTION_ABORTED': return null
		case 'SELECTFILTER_SELECT_SUGGESTION': return action.index
		case 'SELECTFILTER_FINISH_SUGGESTION': return null
		default: return state
	}
}
