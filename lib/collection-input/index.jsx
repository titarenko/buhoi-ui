const { combineReducers } = require('redux')
const { actions: { read } } = require('buhoi-client')

require('./style.scss')

module.exports = CollectionInput
module.exports.reducer = combineReducers({
	value: valueReducer,
	search: searchReducer,
	suggesting: suggestingReducer,
	request: requestReducer,
	items: itemsReducer,
	index: indexReducer,
	query: queryReducer,
})
module.exports.actions = { setValue }

function CollectionInput (props) {
	const { value, search, onChange, dispatch, resource, label } = props
	const { suggesting, request, items, index, query } = props

	if (suggesting && !items && !request) {
		dispatch(read('COLLECTION_INPUT_LOADING', resource, query ? { q: JSON.stringify(query) } : undefined))
	}

	return <div className="collection-input">
		{label ? <div className="label">{label}</div> : null}
		<div className="input">
			{value.map(it => <span onClick={() => remove(it)}>{it.name} &#10005;</span>)}
			<input
				type="text"
				value={search}
				onKeyDown={handleKeypress}
				onInput={ev => suggest(ev.target.value)}
				onBlur={finish}
				onFocus={() => suggest(search)}
			/>
		</div>
		{items ? <div className="suggestion">
			{items.map((it, i) => <span
				className={i == index ? 'selected' : null}
				onMouseDown={() => add(it)}
			>{it.name}</span>)}
		</div> : null}
	</div>

	function handleKeypress (e) {
		if (e.keyCode == 8 && !search) {
			remove(value[value.length - 1])
		}
		if ((e.keyCode == 37 || e.keyCode == 38) && index > 0) {
			e.preventDefault()
			dispatch(setIndex(index - 1))
		}
		if ((e.keyCode == 39 || e.keyCode == 40) && index < items.length - 1) {
			e.preventDefault()
			dispatch(setIndex(index + 1))
		}
		if (e.keyCode == 13 && index != null) {
			add(items[index])
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
		if (!suggesting) {
			dispatch(startSuggesting())
		}
		dispatch(setSearch(search))
	}

	function finish () {
		dispatch(finishSuggesting())
	}
}

function setValue (value) {
	return { type: 'COLLECTION_INPUT_SET_VALUE', value }
}

function setSearch (search) {
	return { type: 'COLLECTION_INPUT_SET_SEARCH', search }
}

function setIndex (index) {
	return { type: 'COLLECTION_INPUT_SET_INDEX', index }
}

function startSuggesting () {
	return { type: 'COLLECTION_INPUT_START_SUGGESTING' }
}

function finishSuggesting () {
	return { type: 'COLLECTION_INPUT_FINISH_SUGGESTING' }
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
		case 'COLLECTION_INPUT_FINISH_SUGGESTING': return ''
		default: return state
	}
}

function suggestingReducer (state = false, action) {
	switch (action.type) {
		case 'COLLECTION_INPUT_START_SUGGESTING': return true
		case 'COLLECTION_INPUT_FINISH_SUGGESTING': return false
		default: return state
	}
}

function requestReducer (state = null, action) {
	switch (action.type) {
		case 'COLLECTION_INPUT_LOADING_STARTED': return action.request
		case 'COLLECTION_INPUT_LOADING_SUCCEEDED': return null
		case 'COLLECTION_INPUT_LOADING_FAILED': return null
		default: return state
	}
}

function itemsReducer (state = null, action) {
	switch (action.type) {
		case 'COLLECTION_INPUT_LOADING_STARTED': return null
		case 'COLLECTION_INPUT_LOADING_SUCCEEDED': return action.result
		case 'COLLECTION_INPUT_LOADING_FAILED': return null
		case 'COLLECTION_INPUT_SET_VALUE': return null
		case 'COLLECTION_INPUT_SET_SEARCH': return null
		case 'COLLECTION_INPUT_FINISH_SUGGESTING': return null
		default: return state
	}
}

function indexReducer (state = null, action) {
	switch (action.type) {
		case 'COLLECTION_INPUT_LOADING_STARTED': return null
		case 'COLLECTION_INPUT_LOADING_SUCCEEDED': return 0
		case 'COLLECTION_INPUT_LOADING_FAILED': return null
		case 'COLLECTION_INPUT_SET_INDEX': return action.index
		case 'COLLECTION_INPUT_FINISH_SUGGESTING': return null
		default: return state
	}
}

function queryReducer (state = null, action) {
	switch (action.type) {
		case 'COLLECTION_INPUT_SET_VALUE':
			return Object.assign(
				{ },
				state,
				{ not: { 'id in': action.value.length > 0 ? action.value.map(it => it.id) : undefined } }
			)
		case 'COLLECTION_INPUT_SET_SEARCH':
			return Object.assign(
				{ },
				state,
				{ 'name ilike': action.search ? `%${action.search}%` : undefined }
			)
		case 'COLLECTION_INPUT_FINISH_SUGGESTING':
			return null
		default:
			return state
	}
}