require('./generic.scss')

const List = require('./list')
const Edit = require('./edit')
const Multiselect = require('./multiselect')
const Select = require('./select')
const Menu = require('./menu')
const Same = require('./same')
const TextInput = require('./text-input')

const components = {
	List,
	Edit,
	Multiselect,
	Menu,
	Same,
	TextInput,
}

module.exports = components

if (process.env.NODE_ENV == 'development') {
	const { createStore, combineReducers, applyMiddleware } = require('redux')
	const logger = require('redux-logger')
	const reduxThunk = require('redux-thunk')

	const reducer = combineReducers({
		textInput: TextInput.reducer,
		select: Select.reducer,
	})

	const middleware = applyMiddleware(reduxThunk.default, logger())
	const store = createStore(reducer, middleware)

	store.subscribe(() => setTimeout(render, 0))

	function render () { // eslint-disable-line no-inner-declarations
		const props = { ...store.getState(), dispatch: store.dispatch }
		const dom = AllComponents(props)
		const node = document.getElementById('root')
		Inferno.render(dom, node)
	}

	store.dispatch(TextInput.actions.setValue('hi'))
	store.dispatch(Select.actions.setValue({ id: 2 }))

	if (module.hot) {
		module.hot.accept(() => store.dispatch({ type: 'HOT_RELOAD' }))
	}

	function AllComponents ({ textInput, select, dispatch }) { // eslint-disable-line no-inner-declarations
		return <div>
			<p>soooqa: {textInput.value}</p>
			<TextInput {...textInput} label="text input 1" onChange={v => dispatch(TextInput.actions.setValue(v))} />
			<Select {...select}
				resource="/api/countries"
				label="Super Select"
				onChange={v => dispatch(Select.actions.setValue(v))}
				dispatch={dispatch} />
		</div>
	}
}