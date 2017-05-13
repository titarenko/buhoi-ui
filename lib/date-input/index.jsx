const { combineReducers } = require('redux')
const moment = require('moment')

require('./style.scss')

const Outside = require('../outside')
const Calendar = require('../calendar')
const Same = require('../same')

module.exports = DateInput
module.exports.reducer = combineReducers({
	value: valueReducer,
	opened: openedReducer,
})
module.exports.actions = { setValue }

function DateInput (props) {
	const { label, value, onChange, mode, opened, dispatch } = props
	if (!value) {
		return <Same />
	}

	return <div className="date-input">
		<Outside onClick={() => dispatch(toggleCalendar(false))}>
			{label ? <div className="label">{label}</div> : null}
			<p onClick={() => dispatch(toggleCalendar())}>{moment(value).format('L')}</p>
			{opened ? <Calendar value={value} mode={mode} onChange={onChange} /> : null}
		</Outside>
	</div>
}

function valueReducer (state = null, action) {
	switch (action.type) {
		case 'DATE_INPUT_SET_VALUE': return action.value
		default: return state
	}
}

function openedReducer (state = false, action) {
	switch (action.type) {
		case 'DATE_INPUT_TOGGLE_CALENDAR': return action.value !== undefined ? action.value : !state
		default: return state
	}
}

function toggleCalendar (value) {
	return { type: 'DATE_INPUT_TOGGLE_CALENDAR', value }
}

function setValue (value) {
	return { type: 'DATE_INPUT_SET_VALUE', value }
}
