require('./style.scss')

const { defaultPeriods, defaultFormat } = require('./enums')
const { combineReducers } = require('buhoi-client')
const Calendar = require('../calendar')

const moment = require('moment')
module.exports = DateRangeInput

DateRangeInput.reducer = combineReducers({
	editing: editingReducer,
	dateRange: dateRangeReducer,
})
module.exports.actions = { setDateRangeValue }

function DateRangeInput ({ editing, options, dateRange, onChange, dispatch }) {
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

	const toggleEditing = () => dispatch({
		type: `SET_DATE_RANGE_MODE_${!editing ? 'OPENED' : 'COLLAPSED'}`,
		editing: !editing,
	})
	const dismiss = () => dispatch({ type: 'SET_DATE_RANGE_MODE_COLLAPSED', editing: false })

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

	return <div className="date-range-input">
		{editing ? <div className="overlay" onClick={dismiss}></div> : null}
		<div className={`input ${editing ? 'editing' : ''}`}>
			<div className="caption" onClick={toggleEditing}>{label} &#8964;</div>
			{editing ? <div className="editor">
					<div className="range">
						<Calendar value={moment(dateRange[0])} dispatch={dispatch} onChange={changeBegin} />
						<Calendar value={moment(dateRange[1])} dispatch={dispatch} onChange={changeEnd} />
						<ul>
							{periods.map(period =>
								<li onClick={() => onChange(period.range)}>
									<span>{period.name}</span>
								</li>
							)}
						</ul>
					</div>
				</div> : null}
		</div>
	</div>
}

function editingReducer (state = null, action) {
	switch (action.type) {
		case 'SET_DATE_RANGE_MODE_COLLAPSED':
		case 'SET_DATE_RANGE_MODE_OPENED': return action.editing
		default: return state
	}
}

function dateRangeReducer (state = null, action) {
	switch (action.type) {
		case 'SET_DATE_RANGE_VALUE': return action.value
		default: return state
	}
}

function setDateRangeValue (value) {
	return { type: 'SET_DATE_RANGE_VALUE', value }
}