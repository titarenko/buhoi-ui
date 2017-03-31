require('./generic.scss')

const Calendar = require('./calendar')
const List = require('./list')
const Edit = require('./edit')
const Multiselect = require('./multiselect')
const Menu = require('./menu')
const Same = require('./same')
const TextInput = require('./text-input')
const Select = require('./select')

const components = {
	Calendar,
	List,
	Edit,
	Multiselect,
	Menu,
	Same,
	TextInput,
	Select,
}

module.exports = components

if (process.env.NODE_ENV == 'development') {
	const { createStore, combineReducers, applyMiddleware } = require('redux')
	const logger = require('redux-logger')
	const thunk = require('redux-thunk')

	const reducer = combineReducers({
		textInput: TextInput.reducer,
		calendar: Calendar.reducer,
		select: Select.reducer,
	})

	const store = createStore(reducer, applyMiddleware(logger.default, thunk.default))

	store.subscribe(() => setTimeout(render, 0))

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

	function AllComponents ({ textInput, calendar, select, dispatch }) { // eslint-disable-line no-inner-declarations
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
		</div>
	}
}