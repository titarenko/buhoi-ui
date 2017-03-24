require('./style.scss')

const moment = require('moment')
const monthNames = moment.monthsShort()
const { combineReducers } = require('buhoi-client')

const weekDays = moment.weekdaysShort()
const firstWeekday = moment.localeData()._week.dow
const dayNames = weekDays.map((name, index) => weekDays[(index + firstWeekday)%7])

module.exports = Calendar

Calendar.reducer = combineReducers({ value: valueReducer })
Calendar.actions = { setValue }
function Calendar (props){
	const { value, onChange } = props

	if (!value) {
		onChange(moment(new Date()))
		return
	}

	const year = moment(value).year()
	const monthNum = moment(value).month()
	const month = monthNames[monthNum]
	const weeks = []

	const currentDate = moment().set({ year, 'month': monthNum, 'date': 1 }).startOf('day')

	while (currentDate.month() == monthNum) {
		const currentWeek = new Array(0,0,0,0,0,0,0)
		weeks.push(currentWeek)
		do {
			const currentDay = currentDate.date()
			currentWeek[currentDate.weekday()] = currentDay
			currentDate.date(currentDay + 1)
		} while (currentDate.month() == monthNum && currentDate.weekday())
	}

	const lastWeek = weeks[weeks.length - 1]
	const dateNextMonth =  Math.max(...lastWeek) + 1
	weeks[weeks.length - 1] =  lastWeek.map(it => it ? it : dateNextMonth)
	const gridDays = weeks.map(days => <tr>{
		days.map(day =>
			<td onClick={() => selectDay(day)} className={getDayClass(day)}>
				{  day && day < dateNextMonth ? day : ' '}
			</td>
		)
	}</tr>)

	function addMonth (count) {
		onChange(moment(value).add(count, 'month'))
	}

	function selectDay (day) {
		onChange(moment(value).date(day))
	}

	function getDayClass (day){
		return ['calendar-selectable', value.date() == day ? 'calendar-selected' : null]
			.filter(x => x).join(' ')
	}

	return <div className="calendar">
		<div className="header">
			<div className="month">
				<span onClick={() => addMonth(-1)}>&larr;</span>
				&nbsp;{month}&nbsp;
				<span onClick={() => addMonth(1)}>&rarr;</span></div>
			<div>{year}</div>
		</div>
		<table>
			<thead>
				<tr>{dayNames.map(name => <th>{name}</th>)}</tr>
			</thead>
			<tbody>
				{ gridDays }
			</tbody>
		</table>
	</div>
}

function valueReducer (state = null, action) {
	switch (action.type) {
		case 'SET_CALENDAR_VALUE': return action.value
		default: return state
	}
}

function setValue (value) {
	return { type: 'SET_CALENDAR_VALUE', value }
}