const { combineReducers } = require('redux')

module.exports = combineReducers({
	query: queryReducer,
	selectedItems: selectedItemsReducer,
	suggestedItems: suggestedItemsReducer,
	selectedSuggestionIndex: selectedSuggestionIndexReducer,
})

function queryReducer (state = '', action) {
	switch (action.type) {
		case 'MULTISELECT_SUGGESTION_STARTED': return action.query
		default: return state
	}
}

function selectedItemsReducer (state = [], action) {
	switch (action.type) {
		case 'MULTISELECT_ADD': return state.some(it => it.id == action.item.id) ? state : [...state, action.item]
		case 'MULTISELECT_REMOVE': return state.filter(it => it.id != action.item.id)
		case 'MULTISELECT_REMOVE_LAST': return state.length > 0 ? state.slice(0, -1) : state
		default: return state
	}
}

function suggestedItemsReducer (state = null, action) {
	switch (action.type) {
		case 'MULTISELECT_SUGGESTION_STARTED': return null
		case 'MULTISELECT_SUGGESTION_SUCCEEDED': return action.items
		case 'MULTISELECT_SUGGESTION_FAILED':
		case 'MULTISELECT_SUGGESTION_ABORTED': return null
		case 'MULTISELECT_FINISH_SUGGESTION': return null
		default: return state
	}
}

function selectedSuggestionIndexReducer (state = null, action) {
	switch (action.type) {
		case 'MULTISELECT_SUGGESTION_STARTED': return null
		case 'MULTISELECT_SUGGESTION_SUCCEEDED': return 0
		case 'MULTISELECT_SUGGESTION_FAILED':
		case 'MULTISELECT_SUGGESTION_ABORTED': return null
		case 'MULTISELECT_SELECT_SUGGESTION': return action.index
		case 'MULTISELECT_FINISH_SUGGESTION': return null
		default: return state
	}
}