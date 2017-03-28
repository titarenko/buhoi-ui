const { combineReducers } = require('redux')

module.exports = TextInput
module.exports.reducer = combineReducers({ value: valueReducer })
module.exports.actions = { setValue }

require('./style.scss')

function TextInput ({ label, lines, minLines = 5, value, error, sensitive, onChange, preventAutocomplete }) {
	return lines == null
		? <label>
			<span>{label}</span>
			{preventAutocomplete ? <input type="text" style="display:none;" /> : null}
			{preventAutocomplete ? <input type="password" style="display:none;" /> : null}
			<input type={sensitive ? 'password' : 'text'} defaultValue={value} onChange={handleChange} />
			{error ? <span className="validation-error">{error}</span> : null}
		</label>
		: <label>
			<span>{label}</span>
			<textarea defaultValue={value} onChange={handleChange} rows={computeRowsCount()}></textarea>
			{error ? <span className="validation-error">{error}</span> : null}
		</label>

	function handleChange (e) {
		onChange(e.target.value)
	}

	function computeRowsCount () {
		if (!isNaN(Number(lines))) {
			return lines
		}
		return value
			? Math.max(minLines, value.split(/\n\r?/).length)
			: minLines
	}
}

function valueReducer (state = '', action) {
	return action.type == 'TEXT_INPUT_SET_VALUE' ? action.value : state
}

function setValue (value) {
	return { type: 'TEXT_INPUT_SET_VALUE', value }
}