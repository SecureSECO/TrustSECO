import Koa from 'koa';
import serve from 'koa-static';
import apiRouter from './api';
import send from "koa-send";
import cors from '@koa/cors'
import koaBody from "koa-body";
import 'dotenv/config'

const app = new Koa();

app.use(cors()).use(koaBody());

// Api Routes
app.use(apiRouter.routes()).use(apiRouter.allowedMethods());

// Portal serving
app.use(serve('./public'));
app.use(async (ctx, next) => {
    return send(ctx, 'public/index.html');
});

app.listen(3000);

