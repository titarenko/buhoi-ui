require('./style.scss')

const { defaultPeriods, defaultFormat } = require('./enums')
const { combineReducers } = require('buhoi-client')
const Calendar = require('../calendar')

const moment = require('moment')
module.exports = DateRangeInput

DateRangeInput.reducer = combineReducers({
	mode: modeReducer,
	dateRange: dateRangeReducer,
})
module.exports.actions = { setDateRangeValue }

function DateRangeInput ({ mode, dateRange, onChange, options, dispatch }) {
	if (!options) {
		options = {
			periods: defaultPeriods,
			dateFormat: defaultFormat,
		}
	}
	const {
		periods = defaultPeriods,
		dateFormat = defaultFormat,
	} = options

	if (!dateRange) {
		onChange([
			moment().startOf('day').add(-7, 'days').toDate(),
			moment().endOf('day').toDate(),
		])
		return
	}

	const toggleEditing = () => dispatch(setDateRangeMode(mode == 'opened' ? 'collapsed' : 'opened'))
	const dismiss = () => dispatch(setDateRangeMode('collapsed'))

	const changeBegin = d => {
		const beginDate = d.startOf('day').toDate()
		const endDate = dateRange[1]
		if (beginDate <= endDate) {
			onChange([beginDate, endDate])
		} else {
			onChange([beginDate, moment(beginDate).endOf('day').toDate()])
		}
	}
	const changeEnd = d => {
		const beginDate = dateRange[0]
		const endDate = d.endOf('day').toDate()
		if (beginDate <= endDate) {
			onChange([beginDate, endDate])
		} else {
			onChange([moment(endDate).startOf('day').toDate(), endDate])
		}
	}

	const label = `${moment(dateRange[0]).format(dateFormat)} –
		${moment(dateRange[1]).format(dateFormat)}`

	const dateRangeInput = <div className="editor">
		<div className="range">
			<Calendar value={moment(dateRange[0])} onChange={changeBegin} />
			<Calendar value={moment(dateRange[1])} onChange={changeEnd} />
			<ul>
				{periods.map(period =>
					<li onClick={() => onChange(period.range)}>
						<span>{period.name}</span>
					</li>
				)}
			</ul>
		</div>
	</div>

	return <div className="date-range-input">
		{mode == 'opened' ? <div className="overlay" onClick={dismiss}></div> : null}
		<div className={`input ${mode}`}>
			<div className="caption" onClick={toggleEditing}>{label} &#8964;</div>
			{mode == 'opened' ? dateRangeInput : null}
		</div>
	</div>
}

function modeReducer (state = null, action) {
	switch (action.type) {
		case 'SET_DATE_RANGE_MODE': return action.mode
		default: return state
	}
}

function dateRangeReducer (state = null, action) {
	switch (action.type) {
		case 'SET_DATE_RANGE_VALUE': return action.value
		default: return state
	}
}

function setDateRangeMode (mode) {
	return { type: 'SET_DATE_RANGE_MODE', mode }
}

function setDateRangeValue (value) {
	return { type: 'SET_DATE_RANGE_VALUE', value }
}