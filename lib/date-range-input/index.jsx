const { combineReducers } = require('redux')
const moment = require('moment')

const Calendar = require('../calendar')
const Same = require('../same')

require('./style.scss')
const shortcuts = require('./shortcuts')

module.exports = DateRangeInput
module.exports.reducer = combineReducers({ value: valueReducer })
module.exports.actions = { setValue }

function DateRangeInput ({ label, value, onChange }) {
	if (!value) {
		return <Same />
	}

	return <div className="date-range-input">
		<div>{label}</div>
		<div className="range">
			<Calendar value={value[0]} mode="start" onChange={changeStart} />
			<Calendar value={value[1]} mode="end" onChange={changeEnd} />
			<ul>{shortcuts.map(s => <li onClick={() => onChange(s.range)}>{s.name}</li>)}</ul>
		</div>
	</div>

	function changeStart (d) {
		onChange(d <= value[1]
			? [d, value[1]]
			: [d, moment(d).endOf('day').toDate()]
		)
	}

	function changeEnd (d) {
		onChange(value[0] <= d
			? [value[0], d]
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