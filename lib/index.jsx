require('./generic.scss')

const List = require('./list')
const Edit = require('./edit')
const Multiselect = require('./multiselect')
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

	const reducer = combineReducers({ textInput: TextInput.reducer })

	const store = createStore(reducer, applyMiddleware(logger.default))

	store.subscribe(() => {
		const props = { ...store.getState(), dispatch: store.dispatch }
		const dom = AllComponents(props)
		const node = document.getElementById('root')
		Inferno.render(dom, node)
	})

	store.dispatch(TextInput.actions.setValue('hi'))

	if (module.hot) {
		module.hot.accept(() => store.dispatch({ type: 'HOT_RELOAD' }))
	}

	function AllComponents ({ textInput, dispatch }) { // eslint-disable-line no-inner-declarations
		return <div>
			<TextInput
				{...textInput}
				label="text input 1"
				lines="auto"
				onChange={v => dispatch(TextInput.actions.setValue(v))} />
		</div>
	}
}