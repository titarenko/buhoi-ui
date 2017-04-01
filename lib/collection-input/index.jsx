const { combineReducers } = require('redux')
const { actions: { read } } = require('buhoi-client')

require('./style.scss')

module.exports = CollectionInput
module.exports.reducer = combineReducers({
	value: valueReducer,
	query: queryReducer,
	suggestedItems: suggestedItemsReducer,
	selectedSuggestionIndex: selectedSuggestionIndexReducer,
})
module.exports.actions = { setValue }

function CollectionInput (props) {
	const { value, onChange, query, suggestedItems, selectedSuggestionIndex, dispatch, resource } = props

	return <div className="collection-input">
		<div className="input">
			{value.map(it => <span onClick={() => remove(it)}>{it.name} &#10005;</span>)}
			<input
				type="text"
				value={query}
				onKeyDown={handleKeypress}
				onInput={ev => dispatch(suggest(resource, ev.target.value))}
				onBlur={() => dispatch(finishSuggestion())}
				onFocus={() => dispatch(suggest(resource, query))}
			/>
		</div>
		{suggestedItems ? <div className="suggestion">
			{suggestedItems.map((it, i) => <span
				className={i == selectedSuggestionIndex ? 'selected' : null}
				onMouseDown={() => add(it)}
			>{it.name}</span>)}
		</div> : null}
	</div>

	function handleKeypress (e) {
		if (e.keyCode == 8 && !query) {
			remove(value[value.length - 1])
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
			add(suggestedItems[selectedSuggestionIndex])
		}
	}

	function add (item) {
		if (value.every(it => it.id != item.id)) {
			onChange([...value, item])
		}
	}

	function remove (item) {
		onChange(value.filter(it => it.id != item.id))
	}
}

function setValue (value) {
	return { type: 'COLLECTION_INPUT_SET_VALUE', value }
}

function setQuery (query) {
	return { type: 'COLLECTION_INPUT_SET_QUERY', query }
}

function suggest (resource, q) {
	return dispatch => {
		dispatch(setQuery(q))
		dispatch(read('COLLECTION_INPUT_SUGGESTION', resource, { q }))
	}
}

function selectSuggestion (index) {
	return { type: 'COLLECTION_INPUT_SELECT_SUGGESTION', index }
}

function finishSuggestion () {
	return { type: 'COLLECTION_INPUT_FINISH_SUGGESTION' }
}

function valueReducer (state = [], action) {
	switch (action.type) {
		case 'COLLECTION_INPUT_SET_VALUE': return action.value
		default: return state
	}
}

function queryReducer (state = '', action) {
	switch (action.type) {
		case 'COLLECTION_INPUT_SET_QUERY': return action.query
		default: return state
	}
}

function suggestedItemsReducer (state = null, action) {
	switch (action.type) {
		case 'COLLECTION_INPUT_SUGGESTION_STARTED': return null
		case 'COLLECTION_INPUT_SUGGESTION_SUCCEEDED': return action.result
		case 'COLLECTION_INPUT_SUGGESTION_FAILED': return null
		case 'COLLECTION_INPUT_FINISH_SUGGESTION': return null
		default: return state
	}
}

function selectedSuggestionIndexReducer (state = null, action) {
	switch (action.type) {
		case 'COLLECTION_INPUT_SUGGESTION_STARTED': return null
		case 'COLLECTION_INPUT_SUGGESTION_SUCCEEDED': return 0
		case 'COLLECTION_INPUT_SUGGESTION_FAILED': return null
		case 'COLLECTION_INPUT_SELECT_SUGGESTION': return action.index
		case 'COLLECTION_INPUT_FINISH_SUGGESTION': return null
		default: return state
	}
}