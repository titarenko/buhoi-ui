module.exports = TextInput

require('./style.scss')

function TextInput ({ label, value, error, sensitive, onChange, preventAutocomplete }) {
	return <label>
		<span>{label}</span>
		{preventAutocomplete ? <input type="text" style="display:none;" /> : null}
		{preventAutocomplete ? <input type="password" style="display:none;" /> : null}
		<input type={sensitive ? 'password' : 'text'} defaultValue={value} onChange={e => onChange(e.target.value)} />
		{error ? <span className="validation-error">{error}</span> : null}
	</label>
}