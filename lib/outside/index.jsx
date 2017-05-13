module.exports = Outside

function Outside (props) {
	const { onClick } = props
	return <Placeholder
		onComponentDidMount={createListener(onClick)}
		onComponentWillUnmount={releaseListener}>
		{props.children}
	</Placeholder>
}

function Placeholder ({ children }) {
	return <div>{children}</div>
}

function createListener (handler) {
	return domNode => {
		const listener = ev => {
			if (!domNode.contains(ev.target)) {
				handler()
			}
		}
		document.addEventListener('click', listener)
		domNode.__listener = listener
	}
}

function releaseListener (domNode) {
	document.removeEventListener('click', domNode.__listener)
}
