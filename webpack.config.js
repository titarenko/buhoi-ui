const webpack = require('webpack')

module.exports = {
	entry: './lib/index.jsx',
	output: {
		path: `${__dirname}/dist`,
		filename: 'bundle.js',
		libraryTarget: process.env.NODE_ENV == 'development' ? undefined : 'commonjs2',
	},
	externals: process.env.NODE_ENV == 'development' ? undefined : {
		'inferno': { commonjs2: 'inferno' },
		'moment': { commonjs2: 'moment' },
		'buhoi-client': { commonjs2: 'buhoi-client' },
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
		new webpack.DefinePlugin({ 'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV) }),
	] : undefined,
	resolve: { extensions: ['.js', '.jsx'] },
	devtool: 'source-map',
	devServer: {
		contentBase: __dirname,
		proxy: {
			'/api/*': {
				target: 'http://localhost:3000',
				pathRewrite: { '/api' : '' },
			},
		},
	},
}