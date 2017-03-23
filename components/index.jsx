require('./generic.scss')

const List = require('./list')
const Edit = require('./edit')
const Multiselect = require('./multiselect')
const SelectList = require('./select-list')
const Menu = require('./menu')
const Same = require('./same')
const TextInput = require('./text-input')
const { request } = require('buhoi-client')

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

	const reducer = combineReducers({ textInput: TextInput.reducer, geo: SelectList.reducer })
	const middleware = applyMiddleware(reduxThunk.default, logger())
	const store = createStore(reducer, middleware)

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

	function AllComponents ({ textInput, dispatch, geo }) { // eslint-disable-line no-inner-declarations
		const countries = name => request({
			url: '/api/countries',
			qs: { q: encodeURIComponent(JSON.stringify({ 'name ilike': `%${name}%` })) },
		})

		const { setFilter } = List.actions
		const field = 'country'
		const onChange = data => { dispatch(setFilter(field, data)) }
		return <div>
			<TextInput {...textInput} label="text input 1" onChange={v => dispatch(TextInput.actions.setValue(v))} />
			<SelectList resource={countries} dispatch={dispatch} onChange={onChange} {...geo} />
		</div>
	}
}
