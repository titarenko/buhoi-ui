const { combineReducers } = require('redux')
const moment = require('moment')

const DateInput = require('../date-input')
const Same = require('../same')

require('./style.scss')
const shortcuts = require('./shortcuts')

module.exports = DateRangeInput
module.exports.reducer = combineReducers({ value: valueReducer })
module.exports.actions = { setValue }

function DateRangeInput (props) {
	if (!props.value) {
		return <Same />
	}

	const { label, onChange } = props
	const value = props.value.map(it => moment(it))

	return <div className="date-range-input">
		{label ? <div className="label">{label}</div> : null}
		<div className="range">
			<DateInput value={value[0]} mode="start" onChange={changeStart} />
			<DateInput value={value[1]} mode="end" onChange={changeEnd} />
			<ul>{shortcuts.map(s => <li onClick={() => onChange(s.range)}>{s.name}</li>)}</ul>
		</div>
	</div>

	function changeStart (d) {
		const end = value[1].toDate()
		onChange(d <= end
			? [d, end]
			: [d, moment(d).endOf('day').toDate()]
		)
	}

	function changeEnd (d) {
		const start = value[0].toDate()
		onChange(start <= d
			? [start, d]
			: [moment(d).startOf('day').toDate(), d]
		)
	}
}

function valueReducer (state = null, action) {
	switch (action.type) {
		case 'DATE_RANGE_INPUT_SET_VALUE': return action.value
		default: return state
	}
}

function setValue (value) {
	return { type: 'DATE_RANGE_INPUT_SET_VALUE', value }
}