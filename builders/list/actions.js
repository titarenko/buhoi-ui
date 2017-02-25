module.exports = {
	initializeQuery,
	removeQuery,

	setFilter,
	setGrouping,
	setSorting,
	setPage,
	setPageSize,

	loadItems,
	invalidate,
}

function initializeQuery (overrides) {
	return {
		type: 'LIST_SET_QUERY',
		query: {
			grouping: { },
			filtering: { },
			sorting: { },
			paging: { },
			...overrides,
		}
	}
}

function removeQuery () {
	return { type: 'LIST_SET_QUERY', query: null }
}

function setFilter (field, value, invalidateList) {
	return { type: 'LIST_SET_FILTER', field, value, invalidateList }
}

function setGrouping (field, invalidateList = true) {
	return { type: 'LIST_SET_GROUPING', field, invalidateList }
}

function setSorting (field, direction, invalidateList = true) {
	return { type: 'LIST_SET_SORTING', field, direction, invalidateList }
}

function setPage (index, invalidateList = true) {
	return { type: 'LIST_SET_PAGE', index, invalidateList }
}

function setPageSize (size, invalidateList = true) {
	return { type: 'LIST_SET_PAGE_SIZE', size, invalidateList }
}

function loadItems (resource, query) {
	return dispatch => {
		dispatch({ type: 'LIST_LOADING_STARTED' })
		resource(encodeURIComponent(JSON.stringify(query)))
			.then(r => dispatch(r.statusCode < 400
				? { type: 'LIST_LOADING_SUCCEEDED', items: r.body }
				: { type: 'LIST_LOADING_FAILED', reason: r.body })
			)
			.catch(error => dispatch({ type: 'LIST_LOADING_ABORTED', error }))
	}
}

function invalidate () {
	return { type: 'LIST_INVALIDATE' }
}