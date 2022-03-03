import app from './server';
import webpack from 'webpack';
import dev from 'webpack-dev-middleware';

const compiler = webpack(require('../webpack.config.js'));

app.use(dev(compiler, {writeToDisk: true}));
console.log('running');
