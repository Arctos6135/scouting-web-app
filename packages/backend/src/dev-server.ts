import app from './server';
import webpack from 'webpack';
import dev from 'webpack-dev-middleware';
import config from '@scouting-app/web/webpack.config';

const compiler = webpack(config as any);

app.use(dev(compiler, {}));
