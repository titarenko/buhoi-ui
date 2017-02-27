const { combineReducers } = require('buhoi-client')

require('./style.scss')

module.exports = Multiselect

Multiselect.reducer = combineReducers({
	query: queryReducer,
	selectedItems: selectedItemsReducer,
	suggestedItems: suggestedItemsReducer,
	selectedSuggestionIndex: selectedSuggestionIndexReducer,
})

function Multiselect (props) {
	const { resource, value, query, suggestedItems, selectedSuggestionIndex, selectedItems, onChange, dispatch } = props

	return <div className="multiselect">
		<div className="input">
			{selectedItems.map(it => <span onClick={() => dispatch(remove(it))}>{it.name} &#10005;</span>)}
			<input
				type="text"
				value={query}
				onKeyDown={handleKeypress}
				onInput={e => dispatch(suggest(resource, e.target.value))}
				onBlur={e => dispatch(finishSuggestion())}
				onFocus={e => dispatch(suggest(resource, query))}
			/>
		</div>
		{suggestedItems ? <div className="suggestion">
			{suggestedItems.map((it, i) => <span
				className={i == selectedSuggestionIndex ? 'selected' : null}
				onMouseDown={() => dispatch(add(it))}
			>{it.name}</span>)}
		</div> : null}
	</div>

	function handleKeypress (e) {
		if (e.keyCode == 8 && !query) {
			dispatch(removeLast());
		}
		if (e.keyCode == 38 && selectedSuggestionIndex > 0) {
			e.preventDefault()
			dispatch(selectSuggestion(selectedSuggestionIndex - 1))
		}
		if (e.keyCode == 40 && selectedSuggestionIndex < suggestedItems.length - 1) {
			e.preventDefault()
			dispatch(selectSuggestion(selectedSuggestionIndex + 1))
		}
		if (e.keyCode == 13 && selectedSuggestionIndex != null) {
			dispatch(add(suggestedItems[selectedSuggestionIndex]))
		}
	}
}

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

function add (item) {
	return { type: 'MULTISELECT_ADD', item }
}

function remove (item) {
	return { type: 'MULTISELECT_REMOVE', item }
}

function removeLast () {
	return { type: 'MULTISELECT_REMOVE_LAST' }
}

function suggest (resource, query) {
	return dispatch => dispatch({
		type: 'MULTISELECT_SUGGESTION_STARTED',
		query,
		request: resource(query)
			.then(r => r.statusCode < 400
				? dispatch({ type: 'MULTISELECT_SUGGESTION_SUCCEEDED', items: r.body })
				: dispatch({ type: 'MULTISELECT_SUGGESTION_FAILED', reason: r.body || r.statusCode })
			)
			.catch(error => dispatch({ type: 'MULTISELECT_SUGGESTION_ABORTED', reason: error }))
	})
}

function selectSuggestion (index) {
	return { type: 'MULTISELECT_SELECT_SUGGESTION', index }
}

function finishSuggestion () {
	return { type: 'MULTISELECT_FINISH_SUGGESTION' }
}