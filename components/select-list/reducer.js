const { combineReducers } = require('buhoi-client')

module.exports = combineReducers({
	query: queryReducer,
	selectedItem: selectedItemsReducer,
	suggestedItems: suggestedItemsReducer,
	selectedLOADINGIndex: selectedLOADINGIndexReducer,
})


function queryReducer (state = '', action) {
	switch (action.type) {
		case 'SELECT_lIST_LOADING_STARTED': return action.query
		default: return state
	}
}

function selectedItemsReducer (state = null, action) {
	switch (action.type) {
		case 'SELECT_lIST_ADD': return action.item
		default: return state
	}
}

function suggestedItemsReducer (state = null, action) {
	switch (action.type) {
		case 'SELECT_lIST_LOADING_STARTED': return null
		case 'SELECT_lIST_LOADING_SUCCEEDED': return action.items
		case 'SELECT_lIST_LOADING_FAILED':
		case 'SELECT_lIST_LOADING_ABORTED': return null
		case 'SELECT_lIST_FINISH_LOADING': return null
		default: return state
	}
}

function selectedLOADINGIndexReducer (state = null, action) {
	switch (action.type) {
		case 'SELECT_lIST_LOADING_STARTED': return null
		case 'SELECT_lIST_LOADING_SUCCEEDED': return 0
		case 'SELECT_lIST_LOADING_FAILED':
		case 'SELECT_lIST_LOADING_ABORTED': return null
		case 'SELECT_lIST_SELECT_LOADING': return action.index
		case 'SELECT_lIST_FINISH_LOADING': return null
		default: return state
	}
}
