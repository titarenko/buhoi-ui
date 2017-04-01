const { combineReducers } = require('redux')
const { actions: { read } } = require('buhoi-client')

require('./style.scss')

module.exports = CollectionInput
module.exports.reducer = combineReducers({
	value: valueReducer,
	search: searchReducer,
	suggestedItems: suggestedItemsReducer,
	selectedSuggestionIndex: selectedSuggestionIndexReducer,
})
module.exports.actions = { setValue }

function CollectionInput (props) {
	const { value, search, onChange, dispatch, resource, searchToQs, label } = props
	const { suggestedItems, selectedSuggestionIndex } = props

	return <div className="collection-input">
		{label ? <div>{label}</div> : null}
		<div className="input">
			{value.map(it => <span onClick={() => remove(it)}>{it.name} &#10005;</span>)}
			<input
				type="text"
				value={search}
				onKeyDown={handleKeypress}
				onInput={ev => dispatch(suggest(ev.target.value))}
				onBlur={() => dispatch(finishSuggestion())}
				onFocus={() => dispatch(suggest(search))}
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
		if (e.keyCode == 8 && !search) {
			remove(value[value.length - 1])
		}
		if ((e.keyCode == 37 || e.keyCode == 38) && selectedSuggestionIndex > 0) {
			e.preventDefault()
			dispatch(selectSuggestion(selectedSuggestionIndex - 1))
		}
		if ((e.keyCode == 39 || e.keyCode == 40) && selectedSuggestionIndex < suggestedItems.length - 1) {
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

	function suggest (search) {
		return dispatch => {
			dispatch(setSearch(search))
			dispatch(read(
				'COLLECTION_INPUT_SUGGESTION',
				resource,
				searchToQs ? searchToQs(search, value) : undefined
			))
		}
	}
}

function setValue (value) {
	return { type: 'COLLECTION_INPUT_SET_VALUE', value }
}

function setSearch (search) {
	return { type: 'COLLECTION_INPUT_SET_SEARCH', search }
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

function searchReducer (state = '', action) {
	switch (action.type) {
		case 'COLLECTION_INPUT_SET_SEARCH': return action.search
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