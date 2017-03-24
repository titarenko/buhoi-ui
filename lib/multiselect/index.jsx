require('./style.scss')

module.exports = Multiselect
module.exports.reducer = require('./reducer')

function Multiselect (props) {
	const { resource, query, suggestedItems, selectedSuggestionIndex, selectedItems, dispatch } = props

	return <div className="multiselect">
		<div className="input">
			{selectedItems.map(it => <span onClick={() => dispatch(remove(it))}>{it.name} &#10005;</span>)}
			<input
				type="text"
				value={query}
				onKeyDown={handleKeypress}
				onInput={ev => dispatch(suggest(resource, ev.target.value))}
				onBlur={ev_ => dispatch(finishSuggestion())}
				onFocus={ev_ => dispatch(suggest(resource, query))}
			/>
		</div>
		{suggestedItems ? <div className="suggestion">
			{suggestedItems.map((it, i) => <span
				className={i == selectedSuggestionIndex ? 'selected' : null}
				onMouseDown={() => dispatch(add(it))}
			>{it.name}</span>)}
		</div> : null}
	</div>

	function handleKeypress (e) {
		if (e.keyCode == 8 && !query) {
			dispatch(removeLast())
		}
		if (e.keyCode == 38 && selectedSuggestionIndex > 0) {
			e.preventDefault()
			dispatch(selectSuggestion(selectedSuggestionIndex - 1))
		}
		if (e.keyCode == 40 && selectedSuggestionIndex < suggestedItems.length - 1) {
			e.preventDefault()
			dispatch(selectSuggestion(selectedSuggestionIndex + 1))
		}
		if (e.keyCode == 13 && selectedSuggestionIndex != null) {
			dispatch(add(suggestedItems[selectedSuggestionIndex]))
		}
	}
}

function add (item) {
	return { type: 'MULTISELECT_ADD', item }
}

function remove (item) {
	return { type: 'MULTISELECT_REMOVE', item }
}

function removeLast () {
	return { type: 'MULTISELECT_REMOVE_LAST' }
}

function suggest (resource, query) {
	return dispatch => dispatch({
		type: 'MULTISELECT_SUGGESTION_STARTED',
		query,
		request: resource(query)
			.then(r => r.statusCode < 400
				? dispatch({ type: 'MULTISELECT_SUGGESTION_SUCCEEDED', items: r.body })
				: dispatch({ type: 'MULTISELECT_SUGGESTION_FAILED', reason: r.body || r.statusCode })
			)
			.catch(error => dispatch({ type: 'MULTISELECT_SUGGESTION_ABORTED', reason: error })),
	})
}

function selectSuggestion (index) {
	return { type: 'MULTISELECT_SELECT_SUGGESTION', index }
}

function finishSuggestion () {
	return { type: 'MULTISELECT_FINISH_SUGGESTION' }
}