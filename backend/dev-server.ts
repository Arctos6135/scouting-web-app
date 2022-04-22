import app from './server';
import webpack from 'webpack';
import dev from 'webpack-dev-middleware';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const config = require('../webpack.config');

const compiler = webpack(config(process.env));

app.use(dev(compiler, { writeToDisk: true }));