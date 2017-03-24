const { actions: { read } } = require('buhoi-client')

module.exports = {
	resetQuery,

	setFilter,
	setGrouping,
	setSorting,
	setPage,
	setPageSize,

	loadItems,
	invalidate,
}

function resetQuery (overrides) {
	return { type: 'LIST_SET_QUERY', query: overrides }
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
	return read('LIST_LOADING', resource, { query })
}

function invalidate () {
	return { type: 'LIST_INVALIDATE' }
}