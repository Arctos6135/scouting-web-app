/* eslint-disable @typescript-eslint/no-var-requires */
import path from 'path';
import HTMLWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import WorkboxWebpackPlugin from 'workbox-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import * as webpack from 'webpack';


const getconfig: (env: any) => webpack.Configuration = (env: any) => ({
	entry: path.resolve(__dirname, './app/App.tsx'),
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
	devtool: (env?.production as string|undefined) ? undefined : 'source-map',
	mode: (env?.production as string|undefined) ? 'production' : 'development'
});

export default getconfig;