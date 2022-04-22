/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const WorkboxWebpackPlugin = require('workbox-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');


const getconfig = (env) => ({
	entry: path.resolve(__dirname, './app/App.tsx'),
	output: {
		path: path.join(__dirname, 'dist')
	},
	module: {
		rules: [
			{ test: /\.css$/, use: [MiniCssExtractPlugin.loader, 'css-loader'] },
			{ test: /\.tsx?$/, use: {
				loader: 'ts-loader',
				options: {
					configFile: 'tsconfig.webpack.json'
				}
			} }
		]
	},
	plugins: [
		new HTMLWebpackPlugin({
			template: path.join(__dirname, 'app', 'index.html'),
		}),
		new MiniCssExtractPlugin(),
		new WorkboxWebpackPlugin.InjectManifest({
			swSrc: path.join(__dirname, 'app', 'sw.ts'),
			swDest: 'sw.js',
			maximumFileSizeToCacheInBytes: 10 * 1024 * 1024
		}),
		new CopyWebpackPlugin({
			patterns: [
				{from: 'static'}
			]
		})
	],
	resolve: {
		extensions: ['.js', '.json', '.jsx', '.ts', '.tsx']
	},
	devtool: env?.production ? undefined : 'source-map',
	mode: env?.production ? 'production' : 'development'
});

module.exports = getconfig;