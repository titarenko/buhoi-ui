const { combineReducers } = require('redux')
const { actions: { read, write, remove } } = require('buhoi-client')
const Same = require('../same')

module.exports = Edit

Edit.actions = { setField, reset }

Edit.reducer = combineReducers({
	request: requestReducer,
	fields: fieldsReducer,
	error: errorReducer,
	validationErrors: validationErrorsReducer,
	isEditingFinished: isEditingFinishedReducer,
})

function Edit (props) {
	const { resource, id, fields, removable, restorable, dispatch, onFinish } = props
	const { Form, Loading = DefaultLoading, Error = DefaultError } = props

	if (isNotLoaded(props)) {
		dispatch(loadFields(resource, id))
		return <Same />
	}

	if (isLoading(props)) {
		return <Loading {...props} />
	}

	if (isError(props)) {
		return <Error {...props} />
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
		{Form(props)}
		<input type="submit" value="save" />
		{id != null && removable ? <button onClick={handleRemove}>remove</button> : null}
		{id != null && restorable ? <button onClick={handleRestore}>restore</button> : null}
		<button onClick={handleFinish}>cancel</button>
	</form>

	function handleSubmit (e) {
		e.preventDefault()
		dispatch(saveFields(resource, fields))
	}

	function handleRemove (e) {
		e.preventDefault()
		if (confirm('Do you want to remove this item?')) {
			dispatch(removeItem(resource, id))
		}
	}

	function handleRestore (e) {
		e.preventDefault()
		if (confirm('Do you want to restore this item?')) {
			dispatch(restoreItem(resource, id))
		}
	}

	function handleFinish (e) {
		e.preventDefault()
		dispatch(cancelEditing())
	}
}

function isNotLoaded ({ id, fields, request, error }) {
	return id != null && fields == null && request == null && error == null
}

function isLoading ({ request }) {
	return request
}

function isError ({ error }) {
	return error
}

function isNotInitialized ({ id, fields }) {
	return id == null && fields == null
}

function isFinished ({ isEditingFinished }) {
	return isEditingFinished
}

function loadFields (resource, id) {
	return read('EDIT_LOADING', `${resource}/${id}`)
}

function saveFields (resource, fields) {
	return write('EDIT_SAVING', resource, fields)
}

function removeItem (resource, id) {
	return remove('EDIT_REMOVING', resource, id)
}

function restoreItem (resource, id) {
	return write('EDIT_RESTORING', `${resource}.restore`, { id })
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
		case 'EDIT_SAVING_FAILED': return action.error.statusCode == 400 ? action.error.body : { }
		case 'EDIT_RESET': return { }
		default: return state
	}
}

function errorReducer (state = null, action) {
	switch (action.type) {
		case 'EDIT_LOADING_STARTED':
		case 'EDIT_SAVING_STARTED':
		case 'EDIT_REMOVING_STARTED':
		case 'EDIT_RESTORING_STARTED':
		case 'EDIT_LOADING_SUCCEEDED':
		case 'EDIT_SAVING_SUCCEEDED':
		case 'EDIT_REMOVING_SUCCEEDED':
		case 'EDIT_RESTORING_SUCCEEDED':
		case 'EDIT_RESET':
			return null
		case 'EDIT_LOADING_FAILED':
		case 'EDIT_SAVING_FAILED':
		case 'EDIT_REMOVING_FAILED':
		case 'EDIT_RESTORING_FAILED':
			return action.error.statusCode != 400 ? action.error : null
		default:
			return state
	}
}

function isEditingFinishedReducer (state = false, action) {
	switch (action.type) {
		case 'EDIT_INITIALIZE_FIELDS': return false
		case 'EDIT_LOADING_STARTED': return false
		case 'EDIT_SAVING_STARTED': return false
		case 'EDIT_SAVING_SUCCEEDED': return true
		case 'EDIT_CANCEL': return true
		case 'EDIT_RESET': return false
		case 'EDIT_REMOVING_STARTED': return false
		case 'EDIT_REMOVING_SUCCEEDED': return true
		case 'EDIT_RESTORING_STARTED': return false
		case 'EDIT_RESTORING_SUCCEEDED': return true
		default: return state
	}
}

function DefaultLoading () {
	return <p>Loading...</p>
}

function DefaultError ({ error }) {
	return <p>Error: {error.message}</p>
}