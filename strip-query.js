const url = require('url')

module.exports = function (req, res, next) {
	const index = req.url.indexOf('?')
	if (index >= 0) {
		req.url = req.originalUrl = req.url.slice(0, index)
		req._parsedUrl = req._parsedOriginalUrl = url.parse(req.url)
		req.query = { }
	}
	next()
}