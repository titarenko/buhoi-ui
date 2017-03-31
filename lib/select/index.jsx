const { combineReducers } = require('redux')
const { actions: { read } } = require('buhoi-client')

const Same = require('../same')

require('./style.scss')

module.exports = Select
module.exports.actions = { setValue }
module.exports.reducer = combineReducers({
	value: valueReducer,
	items: itemsReducer,
	request: requestReducer,
})

function Select (props) {
	const { value, request, items, dispatch, onChange, label, resource, query } = props

	const isNotLoaded = !items && resource && !request
	if (isNotLoaded) {
		dispatch(fetch(resource, query))
		return <Same />
	}

	const isLoading = request
	if (isLoading) {
		return <Same />
	}

	return <div className="select">
		<span>{label}</span>
		<select onChange={handleChange}>{items.map(it =>
			<option value={it.id} selected={value && value.id == it.id }>{it.name}</option>
		)}</select>
	</div>

	function handleChange (ev) {
		const id = ev.target.value
		onChange(items.find(it => it.id == id))
	}
}

function fetch (resource, query) {
	return read('SELECT_LOADING', resource, query)
}

function setValue (value) {
	return { type: 'SELECT_SET_VALUE', value }
}

function valueReducer (state = null, action) {
	return action.type == 'SELECT_SET_VALUE' ? action.value : state
}

function itemsReducer (state = null, action) {
	switch (action.type) {
		case 'SELECT_LOADING_SUCCEEDED': return action.result
		case 'SELECT_LOADING_STARTED': return null
		case 'SELECT_LOADING_FAILED': return []
		default: return state
	}
}

function requestReducer (state = null, action) {
	switch (action.type) {
		case 'SELECT_LOADING_STARTED':
			return action.request
		case 'SELECT_LOADING_SUCCEEDED':
		case 'SELECT_LOADING_FAILED':
			return null
		default: return state
	}
}