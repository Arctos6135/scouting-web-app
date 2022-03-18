/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const WorkboxWebpackPlugin = require('workbox-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');


module.exports = {
	entry: path.resolve(__dirname, './src/App.tsx'),
	output: {
		path: path.join(__dirname, 'dist')
	},
	module: {
		rules: [
			{ test: /\.css$/, use: [MiniCssExtractPlugin.loader, 'css-loader'] },
			{ test: /\.tsx?$/, use: 'ts-loader' }
		]
	},
	plugins: [
		new HTMLWebpackPlugin({
			template: path.join(__dirname, 'src', 'index.html'),
		}),
		new MiniCssExtractPlugin(),
		new WorkboxWebpackPlugin.InjectManifest({
			swSrc: path.join(__dirname, 'src', 'sw.ts'),
			swDest: 'sw.js',
			maximumFileSizeToCacheInBytes: 6 * 1024 * 1024
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
	devtool: 'source-map',
	mode: 'development'
};
