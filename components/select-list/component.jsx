const { add, suggest, selectSuggestion, finishSuggestion } = require('./actions')

require('./style.scss')
module.exports = SelectList

function SelectList (props) {
	const { resource, query, suggestedItems, selectedSuggestionIndex, selectedItem, dispatch, onChange } = props

	return <div className="select-list">
	<div>
		<input
			readOnly
			type="text"
			value={selectedItem ? selectedItem.name : 'Не указано'}
			onKeyDown={handleKeypress}
			onBlur={ev_ => dispatch(finishSuggestion())}
			onClick={ev_ => dispatch(suggest(resource, query))}
		/>
	</div>
		{suggestedItems ? <div className="select-item">
			{suggestedItems.map(it => <span
				onMouseDown={() => onChange(dispatch(add(it)).item)}>
					{it.name}
				</span>)}
		</div> : null}
	</div>

	function handleKeypress (e) {
		if (e.keyCode == 38 && selectedSuggestionIndex > 0) {
			e.preventDefault()
			dispatch(selectSuggestion(selectedSuggestionIndex - 1))
		}
		if (e.keyCode == 40 && selectedSuggestionIndex < suggestedItems.length - 1) {
			e.preventDefault()
			dispatch(selectSuggestion(selectedSuggestionIndex + 1))
		}
		if (e.keyCode == 13 && selectedSuggestionIndex != null) {
			onChange(dispatch(add(suggestedItems[selectedSuggestionIndex])))
		}
	}

}