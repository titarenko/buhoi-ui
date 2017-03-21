const Same = require('../same')
const { resetQuery, loadItems } = require('./actions')

module.exports = List

function List (props) {
	const {
		resource,
		defaultQuery,

		query,

		Query = NoQuery,
		Table,
		Toolbar = NoToolbar,
		Loading = DefaultLoading,
		LoadingError = DefaultLoadingError,
		Empty = DefaultEmpty,

		dispatch,
	} = props

	if (!Table) {
		throw new Error('Table is required.')
	}

	if (isNotInitialized(props)) {
		dispatch(resetQuery(defaultQuery))
		return <Same {...props} />
	}

	if (isNotLoaded(props)) {
		dispatch(loadItems(resource, query))
		return <Same {...props} />
	}

	if (isLoading(props)) {
		return <Loading {...props} />
	}

	if (isEmpty(props)) {
		return <Empty {...props} />
	}

	if (isLoadingFailed(props)) {
		return <LoadingError {...props} />
	}

	return <div>
		{Query(props)}
		{Toolbar(props)}
		{Table(props)}
	</div>
}

function isNotInitialized ({ query }) {
	return !query
}

function isNotLoaded ({ items, request, error }) {
	return !(items || request || error != null)
}

function isLoading ({ request }) {
	return request
}

function isLoadingFailed ({ error }) {
	return error != null
}

function isEmpty ({ items }) {
	return items != null && items.length == 0
}

function NoQuery () {
}

function NoToolbar () {}

function DefaultEmpty () {
	return <p>No data.</p>
}

function DefaultLoading () {
	return <p>Loading...</p>
}

function DefaultLoadingError ({ error }) {
	return error
		? <p>Loading error: {error.message}</p>
		: <p>Loading error</p>
}