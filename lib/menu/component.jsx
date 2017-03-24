const { navigateTo } = require('buhoi-client')
const Same = require('../same')

require('./style.scss')

module.exports = Menu

function Menu ({ route, items, dispatch }) {
	if (!route) {
		return <Same />
	}
	return <div className="menu">
		{items.map(it => <a
			href={it.url}
			onClick={e => handleClick(e, it.url)}
			className={route.url.includes(it.url) ? 'active' : null}
		>{it.title}</a>)}
	</div>
	function handleClick (e, url) {
		e.preventDefault()
		dispatch(navigateTo(url))
	}
}