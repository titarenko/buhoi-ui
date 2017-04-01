require('./generic.scss')

const CollectionInput = require('./collection-input')
const DateInput = require('./date-input')
const DateRangeInput = require('./date-range-input')
const Edit = require('./edit')
const ItemInput = require('./item-input')
const List = require('./list')
const Menu = require('./menu')
const Same = require('./same')
const TextInput = require('./text-input')

const components = {
	CollectionInput,
	DateInput,
	DateRangeInput,
	Edit,
	ItemInput,
	List,
	Menu,
	Same,
	TextInput,
}

module.exports = components

if (process.env.NODE_ENV == 'development') {
	const { createStore, combineReducers, applyMiddleware } = require('redux')
	const logger = require('redux-logger')
	const thunk = require('redux-thunk')
	const moment = require('moment')

	const reducer = combineReducers({
		collectionInput: CollectionInput.reducer,
		dateInput: DateInput.reducer,
		dateRangeInput: DateRangeInput.reducer,
		itemInput: ItemInput.reducer,
		textInput: TextInput.reducer,
	})

	const store = createStore(reducer, applyMiddleware(thunk.default, logger.default))

	store.subscribe(() => setTimeout(render, 0))

	function render () { // eslint-disable-line no-inner-declarations
		const props = { ...store.getState(), dispatch: store.dispatch }
		const dom = AllComponents(props)
		const node = document.getElementById('root')
		Inferno.render(dom, node)
	}

	store.dispatch(DateInput.actions.setValue(new Date()))
	store.dispatch(TextInput.actions.setValue('hi'))
	store.dispatch(DateRangeInput.actions.setValue([
		moment().startOf('day').toDate(),
		moment().endOf('day').toDate(),
	]))

	if (module.hot) {
		module.hot.accept(() => store.dispatch({ type: 'HOT_RELOAD' }))
	}

	function AllComponents ({ // eslint-disable-line no-inner-declarations
		collectionInput,
		dateInput,
		dateRangeInput,
		itemInput,
		textInput,
		dispatch,
	}) {
		return <div>
			<CollectionInput
				{...collectionInput}
				label="collection"
				resource="/api/countries"
				onChange={v => dispatch(CollectionInput.actions.setValue(v))}
				dispatch={dispatch} />
			<DateInput
				{...dateInput}
				policy="end"
				onChange={v => dispatch(DateInput.actions.setValue(v))} />
			<DateRangeInput
				{...dateRangeInput}
				label="period"
				onChange={v => dispatch(DateRangeInput.actions.setValue(v))} />
			<ItemInput
				{...itemInput}
				label="select"
				optional
				resource="/api/countries"
				onChange={v => dispatch(ItemInput.actions.setValue(v))}
				dispatch={dispatch} />
			<TextInput
				{...textInput}
				label="text input 1"
				lines="auto"
				onChange={v => dispatch(TextInput.actions.setValue(v))} />
		</div>
	}
}