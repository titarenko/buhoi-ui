const Same = require('../same')
const { resetQuery, loadItems } = require('./actions')

module.exports = List

function List (props) {
	const {
		resource,
		defaultQuery,

		query,
		
		Query = NoQuery,
		Head,
		Body,
		Loading = DefaultLoading,
		LoadingError = DefaultLoadingError,

		dispatch,
	} = props

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

	if (isLoadingFailed(props)) {
		return <LoadingError {...props} />
	}

	return <div>
		{Query(props)}
		<table>
			<Head {...props} />
			<Body {...props} />
		</table>
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

function NoQuery () {
}

function DefaultLoading () {
	return <p>Loading...</p>
}

function DefaultLoadingError ({ error }) {
	return error
		? <p>Loading error: {error}.</p>
		: <p>Loading error.</p>
}