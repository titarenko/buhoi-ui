const { combineReducers } = require('buhoi-client')

require('./style.scss')
module.exports = Selectfilter

Selectfilter.reducer = combineReducers({
	query: queryReducer,
	selectedItem: selectedItemsReducer,
	suggestedItems: suggestedItemsReducer,
	selectedSuggestionIndex: selectedSuggestionIndexReducer,
})

function Selectfilter (props) {
	const { resource, query, suggestedItems, selectedSuggestionIndex, selectedItem, dispatch, onChange } = props

	return <div className="selectfilter">
	<div>
		<input
			readOnly
			type="text"
			value={selectedItem ? selectedItem.name : 'Не указано'}
			onKeyDown={handleKeypress}
			onBlur={ev_ => dispatch(finishSuggestion())}
			onClick={ev_ => dispatch(suggest(resource, query))}
		/>
	</div>
		{suggestedItems ? <div className="select-item">
			{suggestedItems.map(it => <span
				onMouseDown={() => onChange(dispatch(add(it)).item)}>
					{it.name}
				</span>)}
		</div> : null}
	</div>

	function handleKeypress (e) {
		if (e.keyCode == 38 && selectedSuggestionIndex > 0) {
			e.preventDefault()
			dispatch(selectSuggestion(selectedSuggestionIndex - 1))
		}
		if (e.keyCode == 40 && selectedSuggestionIndex < suggestedItems.length - 1) {
			e.preventDefault()
			dispatch(selectSuggestion(selectedSuggestionIndex + 1))
		}
		if (e.keyCode == 13 && selectedSuggestionIndex != null) {
			onChange(dispatch(add(suggestedItems[selectedSuggestionIndex])))
		}
	}

}

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

function add (item) {
	return { type: 'SELECTFILTER_ADD', item }
}

function suggest (resource, query) {
	return dispatch => dispatch({
		type: 'SELECTFILTER_SUGGESTION_STARTED',
		query,
		request: resource(query)
			.then(r => r.statusCode < 400
				? dispatch({ type: 'SELECTFILTER_SUGGESTION_SUCCEEDED', items: r.body })
				: dispatch({ type: 'SELECTFILTER_SUGGESTION_FAILED', reason: r.body || r.statusCode })
			)
			.catch(error => dispatch({ type: 'SELECTFILTER_SUGGESTION_ABORTED', reason: error })),
	})
}

function selectSuggestion (index) {
	return { type: 'SELECTFILTER_SELECT_SUGGESTION', index }
}

function finishSuggestion () {
	return { type: 'SELECTFILTER_FINISH_SUGGESTION' }
}