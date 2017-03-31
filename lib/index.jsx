require('./generic.scss')

const Calendar = require('./calendar')
const List = require('./list')
const Edit = require('./edit')
const Multiselect = require('./multiselect')
const Menu = require('./menu')
const Same = require('./same')
const TextInput = require('./text-input')
const Select = require('./select')
const DateRangeInput = require('./date-range-input')

const components = {
	Calendar,
	List,
	Edit,
	Multiselect,
	Menu,
	Same,
	TextInput,
	Select,
	DateRangeInput,
}

module.exports = components

if (process.env.NODE_ENV == 'development') {
	const { createStore, combineReducers, applyMiddleware } = require('redux')
	const logger = require('redux-logger')
	const thunk = require('redux-thunk')
	const moment = require('moment')

	const reducer = combineReducers({
		textInput: TextInput.reducer,
		calendar: Calendar.reducer,
		select: Select.reducer,
		dateRangeInput: DateRangeInput.reducer,
	})

	const store = createStore(reducer, applyMiddleware(logger.default, thunk.default))

	store.subscribe(() => setTimeout(render, 0))

	function render () { // eslint-disable-line no-inner-declarations
		const props = { ...store.getState(), dispatch: store.dispatch }
		const dom = AllComponents(props)
		const node = document.getElementById('root')
		Inferno.render(dom, node)
	}

	store.dispatch(Calendar.actions.setValue(new Date()))
	store.dispatch(TextInput.actions.setValue('hi'))
	store.dispatch(DateRangeInput.actions.setValue([
		moment().startOf('day').toDate(),
		moment().endOf('day').toDate(),
	]))

	if (module.hot) {
		module.hot.accept(() => store.dispatch({ type: 'HOT_RELOAD' }))
	}

	function AllComponents ({ // eslint-disable-line no-inner-declarations
		textInput,
		calendar,
		select,
		dateRangeInput,
		dispatch,
	}) {
		return <div>
			<TextInput
				{...textInput}
				label="text input 1"
				lines="auto"
				onChange={v => dispatch(TextInput.actions.setValue(v))} />
			<Calendar
				{...calendar}
				policy="end"
				onChange={v => dispatch(Calendar.actions.setValue(v))} />
			<Select
				{...select}
				label="select"
				optional
				resource="/api/countries"
				onChange={v => dispatch(Select.actions.setValue(v))}
				dispatch={dispatch} />
			<DateRangeInput
				{...dateRangeInput}
				label="period"
				onChange={v => dispatch(DateRangeInput.actions.setValue(v))} />
		</div>
	}
}