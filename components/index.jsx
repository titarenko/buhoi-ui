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
		dateRangeInput: createScopedReducer('dateRangeInput', DateRangeInput.reducer),
		dateRangeInput2: createScopedReducer('dateRangeInput2', DateRangeInput.reducer),
	})

	const store = createStore(reducers, applyMiddleware(logger()))
	const dateRangeInputDispatch = createScopedDispatch('dateRangeInput', store.dispatch)
	const dateRangeInputDispatch2 = createScopedDispatch('dateRangeInput2', store.dispatch)

	store.subscribe(() => setTimeout(render,0))
	store.dispatch(TextInput.actions.setValue('hi'))

	if (module.hot) {
		module.hot.accept(() => store.dispatch({ type: 'HOT_RELOAD' }))
	}

	function AllComponents ({ // eslint-disable-line no-inner-declarations
		textInput,
		dateRangeInput,
		dateRangeInput2,
		dispatch,
		dateRangeInputDispatch,
		dateRangeInputDispatch2,
	}) {
		return <div>
			<TextInput {...textInput} label="text input" onChange={v => dispatch(TextInput.actions.setValue(v))} />
			<DateRangeInput
				{...dateRangeInput}
				onChange={d => dateRangeInputDispatch(DateRangeInput.actions.setDateRangeValue(d))}
				options={optionsDateRangeInput}
				dispatch={dateRangeInputDispatch}
			/>
			<DateRangeInput
				{...dateRangeInput2}
				onChange={d => dateRangeInputDispatch2(DateRangeInput.actions.setDateRangeValue(d))}
				options={optionsDateRangeInput}
				dispatch={dateRangeInputDispatch2}
			/>
		</div>
	}

	function render () { // eslint-disable-line no-inner-declarations
		const props = { ...store.getState(), dispatch: store.dispatch, dateRangeInputDispatch, dateRangeInputDispatch2 }
		const dom = AllComponents(props)
		const node = document.getElementById('root')
		Inferno.render(dom, node)
	}

	function createScopedReducer (scope, reducer) {  // eslint-disable-line no-inner-declarations
		return (state, action) => state === undefined || action.scope == scope
			? reducer(state, action)
			: state
	}

	function createScopedDispatch (scope, dispatch) {  // eslint-disable-line no-inner-declarations
		return action => typeof action == 'function'
			? dispatch((thunkDispatch, ...thunkExtraArgs) => action(
				createScopedDispatch(scope, thunkDispatch),
				...thunkExtraArgs
			))
			: dispatch({ ...action, scope })
	}
}