const moment = require('moment')

module.exports = {
	defaultPeriods: [
		{
			name: 'Today',
			range: [
				moment().startOf('day'),
				moment().endOf('day'),
			],
		},
		{
			name: 'Yesterday',
			range: [
				moment().subtract(1, 'day').startOf('day'),
				moment().subtract(1, 'day').endOf('day'),
			],
		},
		{
			name: 'This Week',
			range: [
				moment().startOf('week'),
				moment().endOf('day'),
			],
		},
		{
			name: 'Last 1 Week',
			range: [
				moment().subtract(1, 'week').startOf('week'),
				moment().subtract(1, 'week').endOf('week'),
			],
		},
		{
			name: 'This Month',
			range: [
				moment().startOf('month'),
				moment().endOf('day'),
			],
		},
		{
			name: 'Last Month',
			range: [
				moment().add(-1, 'month').startOf('month'),
				moment().add(-1, 'month').endOf('month'),
			],
		},
		{
			name: 'Last 2 Month',
			range: [
				moment().add(-2, 'month').startOf('month'),
				moment().add(-2, 'month').endOf('month'),
			],
		},
		{
			name: 'This Year',
			range: [
				moment().startOf('year'),
				moment().endOf('day'),
			],
		},
	],
	defaultFormat: moment.localeData().longDateFormat('L'),
}
