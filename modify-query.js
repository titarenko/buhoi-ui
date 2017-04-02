module.exports = function (req, res, next) {
	if (req.query.q) {
		const query = JSON.parse(req.query.q)

		const name = query['name ilike']
		const not = query['not']
		const ids = not && not['id in']

		req.query = [
			['name_like', name ? name.slice(1, -1) : undefined],
			['id_ne', ids ? ids[0] : undefined],
		].filter(it => it[1]).reduce((q, c) => Object.assign(q, { [c[0]]: c[1] }), { })
	}
	next()
}