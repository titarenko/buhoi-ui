const { Same } = require('../components/same')
const { initializeQuery, loadItems } = require('./actions')

module.exports = function ({
	resource,

	defaultQuery,

	Query,
	Head,
	Body,

	Loading = DefaultLoading,
	LoadingError = DefaultLoadingError,
}) {
	return function (props) {
		const { query, dispatch } = props

		if (isNotInitialized(props)) {
			dispatch(initializeQuery(defaultQuery))
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
			<Query {...props} />
			<table>
				<Head {...props} />
				<Body {...props} />
			</table>
		</div>
	}
}

function isNotInitialized ({ query }) {
	return !query
}

function isNotLoaded ({ items, loading, loadingError }) {
	return !(items || loading || loadingError)
}

function isLoading ({ loading }) {
	return loading
}

function isLoadingFailed ({ loadingError }) {
	return loadingError
}

function DefaultLoading () {
	return <div>TODO: spinner</div>
}

function DefaultLoadingError ({ error }) {
	return <p>{error}</p>
}