const { combineReducers } = require('redux')

module.exports = TextInput
module.exports.reducer = combineReducers({ value: valueReducer })
module.exports.actions = { setValue }

require('./style.scss')

function TextInput ({ label, value, error, sensitive, onChange, preventAutocomplete }) {
	return <label>
		<span>{label}</span>
		{preventAutocomplete ? <input type="text" style="display:none;" /> : null}
		{preventAutocomplete ? <input type="password" style="display:none;" /> : null}
		<input type={sensitive ? 'password' : 'text'} defaultValue={value} onChange={e => onChange(e.target.value)} />
		{error ? <span className="validation-error">{error}</span> : null}
	</label>
}

function valueReducer (state = '', action) {
	return action.type == 'TEXT_INPUT_SET_VALUE' ? action.value : state
}

function setValue (value) {
	return { type: 'TEXT_INPUT_SET_VALUE', value }
}