require('./style.scss')

const { combineReducers } = require('buhoi-client')

const Calendar = require('../calendar')

const moment = require('moment')

const weekDays = moment.weekdaysShort()
const firstWeekday = moment.localeData()._week.dow
const periods = [
	{
		name: 'за сегодня',
		range: [
			moment().startOf('day'),
			moment().endOf('day'),
		],
	},
	{
		name: 'за вчера',
		range: [
			moment().subtract(1, 'day').startOf('day'),
			moment().subtract(1, 'day').endOf('day'),
		],
	},
	{
		name: 'за текущую неделю',
		range: [
			moment().startOf('week'),
			moment().endOf('day'),
		],
	},
	{
		name: 'за прошлую неделю',
		range: [
			moment().subtract(1, 'week').startOf('week'),
			moment().subtract(1, 'week').endOf('week'),
		],
	},
	{
		name: 'за текущий месяц',
		range: [
			moment().startOf('month'),
			moment().endOf('day'),
		],
	},
	{
		name: 'за прошлый месяц',
		range: [
			moment().add(-1, 'month').startOf('month'),
			moment().add(-1, 'month').endOf('month'),
		],
	},
	{
		name: 'за позапрошлый месяц',
		range: [
			moment().add(-2, 'month').startOf('month'),
			moment().add(-2, 'month').endOf('month'),
		],
	},
	{
		name: 'за текущий год',
		range: [
			moment().startOf('year'),
			moment().endOf('day'),
		],
	},
]

module.exports = DateRangeFilter

DateRangeFilter.reducer = combineReducers({
	editing: editingReducer,
	dateRangeFilter: dateRangeFilterReducer,
})

function DateRangeFilter ({ dispatch, editing=false, dateRangeFilter, onChange }) {

	if (!dateRangeFilter) {
		onChange(dispatch(setDateRangeFilter([
			moment().startOf('day').add(-7, 'days').toDate(),
			moment().endOf('day').toDate(),
		])).value)
		return
	}

	const toggleEditing = () => dispatch({ type: 'SET_DRF_EDITING', editing: !editing })
	const dismiss = () => dispatch({ type: 'SET_DRF_EDITING', editing: false })

	const changeBegin = d => {
		const beginDate = d.startOf('day').toDate()
		const endDate = dateRangeFilter[1]
		if (beginDate <= endDate) {
			onChange(dispatch(setDateRangeFilter([beginDate, endDate])).value)
		} else {
			onChange(dispatch(setDateRangeFilter([beginDate, moment(beginDate).endOf('day').toDate()])))
		}
	}
	const changeEnd = d => {
		const beginDate = dateRangeFilter[0]
		const endDate = d.endOf('day').toDate()
		if (beginDate <= endDate) {
			onChange(dispatch(setDateRangeFilter([beginDate, endDate])).value)
		} else {
			onChange(dispatch(setDateRangeFilter([moment(endDate).startOf('day').toDate(), endDate])).value)
		}
	}

	const dateFormat = 'DD.MM.YYYY'
	const label = `${moment(dateRangeFilter[0]).format(dateFormat)} –
		${moment(dateRangeFilter[1]).format(dateFormat)}`

	return <div className="date-range-filter">
		{editing ? <div className="overlay" onClick={dismiss}></div> : null}
		<div className={`filter ${editing ? 'editing' : ''}`}>
			<div className="caption" onClick={toggleEditing}>{label} &#8964;</div>
			{editing ? <div className="editor">
					<div className="range">
						<Calendar value={moment(dateRangeFilter[0])} dispatch={dispatch} onChange={changeBegin} />
						<Calendar value={moment(dateRangeFilter[1])} dispatch={dispatch} onChange={changeEnd} />
						<ul>
							{periods.map(period =>
								<li onClick={() => onChange(dispatch(setDateRangeFilter(period.range)).value)}>
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
		case 'SET_DRF_EDITING': return action.editing
		default: return state
	}
}

function dateRangeFilterReducer (state = null, action) {
	switch (action.type) {
		case 'SET_DATE_RANGE_FILTER': return action.value
		default: return state
	}
}

function setDateRangeFilter (value) {
	return { type: 'SET_DATE_RANGE_FILTER', value }
}