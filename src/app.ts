import Koa from 'koa';
import serve from 'koa-static';
import apiRouter from './api';

import send from "koa-send";
import * as child_process from "child_process";

const app = new Koa();

app.use(serve('./public'));
app.use(apiRouter.routes()).use(apiRouter.allowedMethods());

app.use(async (ctx, next) => {
    return send(ctx, 'public/index.html');
});

app.listen(3000);

const dlt = child_process.spawn('npm', ['run', 'start-dlt'], {
    env: {
        NODE_ENV: 'production',
        PATH: process.env.PATH
    }
});

dlt.stdout.on('error', (err) => {
    console.log(err);
});
