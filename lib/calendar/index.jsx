const moment = require('moment')

require('./style.scss')

const weekDays = moment.weekdaysMin()
const firstWeekday = moment.localeData()._week.dow
const dayNames = weekDays.map((name, index) => weekDays[(index + firstWeekday)%7])


module.exports = Calendar

function Calendar (props) {
	const { mode = 'start', onChange } = props
	const value = mode == 'start'
		? moment(props.value).startOf('day')
		: moment(props.value).endOf('day')

	return <div className="calendar">
		<div className="header">
			{getMonthChangeButton({ value, months: -1, handleChange })}
			<div> {value.format('MMM YYYY')} </div>
			{getMonthChangeButton({ value, months: 1, handleChange })}
		</div>
		<table>
			<thead>
				<tr>{dayNames.map(name => <th>{name}</th>)}</tr>
			</thead>
			<tbody>{getWeeks(value).map(days =>
				<tr>{days.map(day => day
					? <td
						onClick={() => handleChange(day)}
						className={value.date() == day.date() ? 'selected' : 'selectable'}
					>{day.format('D')}</td>
					: <td></td>
				)}
				</tr>
			)}</tbody>
		</table>
	</div>

	function handleChange (nextValue) {
		onChange(nextValue.toDate())
	}
}

function getWeeks (value) {
	const weeks = []
	const currentDate = moment(value).date(1)
	while (currentDate.month() == value.month()) {
		const currentWeek = [null, null, null, null, null, null, null]
		do {
			currentWeek[currentDate.weekday()] = moment(currentDate)
			currentDate.add({ days: 1 })
		} while (currentDate.month() == value.month() && currentDate.weekday())
		weeks.push(currentWeek)
	}
	return weeks
}

function getMonthChangeButton ({ value, months, handleChange }) {
	const nextValue = moment(value).add({ months })
	return months > 0
		? <div onClick={() => handleChange(nextValue)}>&rarr; {nextValue.format('MMM')}</div>
		: <div onClick={() => handleChange(nextValue)}>{nextValue.format('MMM')} &larr;</div>
}
