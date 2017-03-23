
module.exports = {
	add,
	suggest,
	selectSuggestion,
	finishSuggestion,
}

function add (item) {
	return { type: 'SELECTFILTER_ADD', item }
}

function suggest (resource, query) {
	return dispatch => dispatch({
		type: 'SELECTFILTER_SUGGESTION_STARTED',
		query,
		request: resource(query)
			.then(r => r.statusCode < 400
				? dispatch({ type: 'SELECTFILTER_SUGGESTION_SUCCEEDED', items: r.body })
				: dispatch({ type: 'SELECTFILTER_SUGGESTION_FAILED', reason: r.body || r.statusCode })
			)
			.catch(error => dispatch({ type: 'SELECTFILTER_SUGGESTION_ABORTED', reason: error })),
	})
}

function selectSuggestion (index) {
	return { type: 'SELECTFILTER_SELECT_SUGGESTION', index }
}

function finishSuggestion () {
	return { type: 'SELECTFILTER_FINISH_SUGGESTION' }
}