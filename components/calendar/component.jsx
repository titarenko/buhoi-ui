require('./style.scss')

const moment = require('moment')
const monthNames = moment.monthsShort()

const weekDays = moment.weekdaysShort()
const firstWeekday = moment.localeData()._week.dow
const dayNames = weekDays.map((name, index) => weekDays[(index + firstWeekday)%7])

module.exports = Calendar

Calendar.reducer = valueReducer

function Calendar (props){
	const {	value, onChange, dispatch } = props

	if (!value) {
		onChange(dispatch(setDate(moment(new Date()))).value)
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

	function addMonth (count) {
		onChange(dispatch(setDate(moment(value).add(count, 'month'))).value)
	}

	function selectDay (day) {
		onChange(dispatch(setDate(moment(value).date(day))).value)
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
				{	weeks.map(days => <tr>{
							days.map(day =>
								<td onClick={() => selectDay(day)} className={getDayClass(day)}>
									{  day && day < dateNextMonth ? day : ' '}
								</td>
							)
					}</tr>
				)}
			</tbody>
		</table>
	</div>
}

function valueReducer (state = null, action) {
	switch (action.type) {
		case 'SET_CALENDAR_DATE': return action.value
		default: return state
	}
}

function setDate (value) {
	return { type: 'SET_CALENDAR_DATE', value }
}