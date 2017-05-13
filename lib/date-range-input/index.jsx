const { combineReducers } = require('redux')
const moment = require('moment')

const Outside = require('../outside')
const Calendar = require('../calendar')
const Same = require('../same')

require('./style.scss')
const shortcuts = require('./shortcuts')

module.exports = DateRangeInput
module.exports.reducer = combineReducers({
	value: valueReducer,
	opened: openedReducer,
})
module.exports.actions = { setValue }

function DateRangeInput (props) {
	if (!props.value) {
		return <Same />
	}

	const { label, onChange, opened, dispatch } = props
	const value = props.value.map(it => moment(it))

	return <div className="date-range-input">
		{label ? <div className="label">{label}</div> : null}
		<Outside onClick={() => dispatch(toggleCalendars(false))}>
			<p onClick={() => dispatch(toggleCalendars())}>
				{moment(value[0]).format('L')} &ndash; {moment(value[1]).format('L')}
			</p>
			{opened ? <div className="range">
				<Calendar value={value[0]} mode="start" onChange={changeStart} dispatch={dispatch} />
				<Calendar value={value[1]} mode="end" onChange={changeEnd} dispatch={dispatch} />
				<ul>{shortcuts.map(s => <li onClick={() => onChange(s.range)}>{s.name}</li>)}</ul>
			</div> : null}
		</Outside>
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

function openedReducer (state = false, action) {
	switch (action.type) {
		case 'DATE_RANGE_INPUT_TOGGLE_CALENDARS': return action.value !== undefined ? action.value : !state
		default: return state
	}
}

function setValue (value) {
	return { type: 'DATE_RANGE_INPUT_SET_VALUE', value }
}

function toggleCalendars (value) {
	return { type: 'DATE_RANGE_INPUT_TOGGLE_CALENDARS', value }
}