import Koa from 'koa';
import serve from 'koa-static';
import send from 'koa-send';
import cors from '@koa/cors';
import koaBody from 'koa-body';
import websockify from 'koa-websocket';
import apiRouter from './api';
import websocketRouter from './websocket';
import 'dotenv/config';
import * as spiderService from './services/spider-service';

const app = websockify(new Koa());

app.use(cors()).use(koaBody());

// Api Routes
app.use(apiRouter.routes()).use(apiRouter.allowedMethods());

// Websocket routes
app.ws.use(websocketRouter.routes()).use(websocketRouter.allowedMethods());

// Portal serving
app.use(serve('./public'));
app.use(async (ctx, next) => send(ctx, 'public/index.html'));

app.listen(3000);

spiderService.runWorker();
