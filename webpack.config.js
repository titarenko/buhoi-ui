const webpack = require('webpack')

module.exports = {
	entry: './components/index.js',
	output: {
		path: __dirname,
		filename: 'dist.js',
		libraryTarget: 'commonjs2',
	},
	externals: {
		'inferno': { commonjs2: 'inferno' },
		'buhoi-client': { commonjs2: 'buhoi-client' },
		'lodash.get': { commonjs2: 'lodash.get' },
		'lodash.set': { commonjs2: 'lodash.set' },
	},
	module: {
		rules: [
			{
				test: /\.jsx?$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
					options: {
						plugins: ['syntax-jsx', 'inferno'],
						presets: ['stage-0', 'es2015'],
					},
				},
			},
			{
				test: /\.scss$/,
				use: ['style-loader', 'css-loader', 'sass-loader'],
			},
		],
	},
	resolve: { extensions: ['.js', '.jsx'] },
}