const { combineReducers } = require('redux')
const { actions: { read } } = require('buhoi-client')

const Same = require('../same')

require('./style.scss')

module.exports = ItemInput
module.exports.actions = { setValue }
module.exports.reducer = combineReducers({
	value: valueReducer,
	items: itemsReducer,
	request: requestReducer,
})

function ItemInput (props) {
	const { value, request, items, dispatch, onChange, label, resource, query, optional } = props

	const isNotLoaded = !items && resource && !request
	if (isNotLoaded) {
		dispatch(fetch(resource, query))
		return <Same />
	}

	const isLoading = request
	if (isLoading) {
		return <Same />
	}

	const options = optional
		? [{ id: null, name: 'any' }].concat(items)
		: items

	return <div className="item-input">
		{label ? <div className="label">{label}</div> : undefined}
		<select onChange={handleChange}>{options.map(it =>
			<option value={it.id} selected={value && value.id == it.id }>{it.name}</option>
		)}</select>
	</div>

	function handleChange (ev) {
		const id = ev.target.value
		onChange(id == 'null' && optional
			? options[0]
			: options.find(it => it.id == id)
		)
	}
}

function fetch (resource, query) {
	return read('ITEM_INPUT_LOADING', resource, query)
}

function setValue (value) {
	return { type: 'ITEM_INPUT_SET_VALUE', value }
}

function valueReducer (state = null, action) {
	return action.type == 'ITEM_INPUT_SET_VALUE' ? action.value : state
}

function itemsReducer (state = null, action) {
	switch (action.type) {
		case 'ITEM_INPUT_LOADING_SUCCEEDED': return action.result
		case 'ITEM_INPUT_LOADING_STARTED': return null
		case 'ITEM_INPUT_LOADING_FAILED': return []
		default: return state
	}
}

function requestReducer (state = null, action) {
	switch (action.type) {
		case 'ITEM_INPUT_LOADING_STARTED':
			return action.request
		case 'ITEM_INPUT_LOADING_SUCCEEDED':
		case 'ITEM_INPUT_LOADING_FAILED':
			return null
		default: return state
	}
}