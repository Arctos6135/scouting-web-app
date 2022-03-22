import app from './server';
import webpack from 'webpack';
import dev from 'webpack-dev-middleware';
import config from '../webpack.config.js';

const compiler = webpack(config(process.env));

app.use(dev(compiler, {writeToDisk: true}));