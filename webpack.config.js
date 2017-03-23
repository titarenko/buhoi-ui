const webpack = require('webpack')

module.exports = {
	entry: './components/index.js',
	output: {
		path: __dirname,
		filename: 'dist.js',
		libraryTarget: process.env.NODE_ENV == 'development' ? undefined : 'commonjs2',
	},
	externals: process.env.NODE_ENV == 'development' ? undefined : {
		'inferno': { commonjs2: 'inferno' },
		'buhoi-client': { commonjs2: 'buhoi-client' },
		'lodash.get': { commonjs2: 'lodash.get' },
		'lodash.set': { commonjs2: 'lodash.set' },
	},
	module: {
		rules: [
			{
				test: /\.jsx?$/,
				exclude: /(node_modules)|(buhoi-client)/,
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
	plugins: process.env.NODE_ENV == 'development' ? [
		new webpack.ProvidePlugin({ 'Inferno': 'inferno' }),
		new webpack.DefinePlugin('process.env.NODE_ENV', JSON.stringify(process.env.NODE_ENV)),
	] : undefined,
	resolve: { extensions: ['.js', '.jsx'] },
	devtool: 'source-map',
	devServer: { contentBase: __dirname },
}