const moment = require('moment')

module.exports = [
	{
		name: 'today',
		range: range('day'),
	},
	{
		name: 'yesterday',
		range: range('day', { days: -1 }),
	},
	{
		name: 'this week',
		range: range('week'),
	},
	{
		name: 'last week',
		range: range('week', { weeks: -1 }),
	},
	{
		name: 'week before last',
		range: range('week', { weeks: -2 }),
	},
	{
		name: 'this month',
		range: range('month'),
	},
	{
		name: 'last month',
		range: range('month', { months: -1 }),
	},
	{
		name: 'month before last',
		range: range('month', { months: -2 }),
	},
	{
		name: 'this year',
		range: range('year'),
	},
]

function range (what, addendum) {
	return [start(what, addendum), end(what, addendum)]
}

function start (what, addendum) {
	return moment().add(addendum).startOf(what)
}

function end (what, addendum) {
	return moment().add(addendum).endOf(what)
}