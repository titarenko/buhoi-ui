
module.exports = {
	add,
	suggest,
	selectSuggestion,
	finishSuggestion,
}

function add (item) {
	return { type: 'SELECT_lIST_ADD', item }
}

function suggest (resource, query) {
	return dispatch => dispatch({
		type: 'SELECT_lIST_LOADING_STARTED',
		query,
		request: resource(query)
			.then(r => r.statusCode < 400
				? dispatch({ type: 'SELECT_lIST_LOADING_SUCCEEDED', items: r.body })
				: dispatch({ type: 'SELECT_lIST_LOADING_FAILED', reason: r.body || r.statusCode })
			)
			.catch(error => dispatch({ type: 'SELECT_lIST_LOADING_ABORTED', reason: error })),
	})
}

function selectSuggestion (index) {
	return { type: 'SELECT_lIST_SELECT_LOADING', index }
}

function finishSuggestion () {
	return { type: 'SELECT_lIST_FINISH_LOADING' }
}