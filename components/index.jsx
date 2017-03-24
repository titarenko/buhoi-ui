require('./generic.scss')

const List = require('./list')
const Edit = require('./edit')
const Multiselect = require('./multiselect')
const Menu = require('./menu')
const Same = require('./same')
const TextInput = require('./text-input')
const Calendar = require('./calendar')
const DateRangeInput = require('./date-range-input')

const components = {
	List,
	Edit,
	Multiselect,
	Menu,
	Same,
	TextInput,
	Calendar,
	DateRangeInput,
}

module.exports = components

if (process.env.NODE_ENV == 'development') {
	const { createStore, combineReducers, applyMiddleware } = require('redux')
	const logger = require('redux-logger')
	const moment = require('moment')
	const periods = [{
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
	}]
	const optionsDateRangeInput = {
		periods,
		dateFormat: 'YYYY.MMM.DD',
	}

	const reducers = combineReducers({
		textInput: TextInput.reducer,
		dateRangeInput: DateRangeInput.reducer,
	})

	const store = createStore(reducers, applyMiddleware(logger()))

	store.subscribe(() => setTimeout(render,0))

	function render () { // eslint-disable-line no-inner-declarations
		const props = { ...store.getState(), dispatch: store.dispatch }
		const dom = AllComponents(props)
		const node = document.getElementById('root')
		Inferno.render(dom, node)
	}

	store.dispatch(TextInput.actions.setValue('hi'))

	if (module.hot) {
		module.hot.accept(() => store.dispatch({ type: 'HOT_RELOAD' }))
	}

	function AllComponents ({ textInput, dateRangeInput, dispatch }) { // eslint-disable-line no-inner-declarations
		return <div>
			<TextInput {...textInput} label="text input" onChange={v => dispatch(TextInput.actions.setValue(v))} />
			<DateRangeInput
				{...dateRangeInput}
				onChange={d => dispatch(DateRangeInput.actions.setDateRangeValue(d))}
				options={optionsDateRangeInput}
				dispatch={dispatch}
			/>
		</div>
	}
}