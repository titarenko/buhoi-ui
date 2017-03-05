const { rest, combineReducers } = require('buhoi-client')
const Same = require('../same')

module.exports = Edit

Edit.actions = { setField, reset }

Edit.reducer = combineReducers({
	request: requestReducer,
	fields: fieldsReducer,
	validationErrors: validationErrorsReducer,
	isSavingFinished: isSavingFinishedReducer,
})

function Edit (props) {
	const { resource, id, dispatch, onFinish, Form } = props
	const { fields, validationErrors } = props

	if (isNotLoaded(props)) {
		dispatch(loadFields(resource, id))
		return <Same />
	}

	if (isNotInitialized(props)) {
		dispatch(initializeFields())
		return <Same />
	}

	if (isFinished(props)) {
		onFinish()
		return <Same />
	}

	return <form onSubmit={handleSubmit}>
		{Form({ fields, validationErrors, dispatch, setField })}
		<input type="submit" value="сохранить" />
		<button onClick={handleFinish}>отмена</button>
	</form>

	function handleSubmit (e) {
		e.preventDefault()
		dispatch(saveFields(resource, fields))
	}

	function handleFinish (e) {
		e.preventDefault()
		dispatch(cancelEditing())
	}
}

function isNotLoaded ({ id, fields, request }) {
	return id && fields == null && request == null
}

function isNotInitialized ({ id, fields }) {
	return !id && fields == null
}

function isFinished ({ isSavingFinished }) {
	return isSavingFinished
}

function loadFields (resource, id) {
	return rest.read('EDIT_LOADING', `${resource}/${id}`)
}

function saveFields (resource, fields) {
	return rest.write('EDIT_SAVING', resource, fields)
}

function initializeFields () {
	return { type: 'EDIT_INITIALIZE_FIELDS' }
}

function setField (name, value) {
	return { type: 'EDIT_SET_FIELD', name, value }
}

function cancelEditing () {
	return { type: 'EDIT_CANCEL' }
}

function reset () {
	return { type: 'EDIT_RESET' }
}

function requestReducer (state = null, action) {
	switch (action.type) {
		case 'EDIT_LOADING_STARTED': return action.request
		case 'EDIT_LOADING_SUCCEEDED':
		case 'EDIT_LOADING_FAILED': return null
		case 'EDIT_RESET': return null
		default: return state
	}
}

function fieldsReducer (state = null, action) {
	switch (action.type) {
		case 'EDIT_LOADING_STARTED': return null
		case 'EDIT_LOADING_SUCCEEDED': return action.result
		case 'EDIT_LOADING_FAILED': return null
		case 'EDIT_INITIALIZE_FIELDS': return { }
		case 'EDIT_SET_FIELD': return { ...state, [action.name]: action.value }
		case 'EDIT_RESET': return null
		default: return state
	}
}

function validationErrorsReducer (state = { }, action) {
	switch (action.type) {
		case 'EDIT_SAVING_STARTED':
		case 'EDIT_SAVING_SUCCEEDED': return { }
		case 'EDIT_SAVING_FAILED': return action.error.code == 400 ? action.error.body : { }
		case 'EDIT_RESET': return { }
		default: return state
	}
}

function isSavingFinishedReducer (state = false, action) {
	switch (action.type) {
		case 'EDIT_INITIALIZE_FIELDS': return false
		case 'EDIT_LOADING_STARTED': return false
		case 'EDIT_SAVING_STARTED': return false
		case 'EDIT_SAVING_SUCCEEDED': return true
		case 'EDIT_CANCEL': return true
		case 'EDIT_RESET': return false
		default: return state
	}
}