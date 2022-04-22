import Koa from 'koa';
import serve from 'koa-static';
import apiRouter from './api';
import send from "koa-send";
import child_process from "child_process";
import {WebSocketServer, createWebSocketStream} from 'ws';
import {createServer} from 'http';

const app = new Koa();

// Api Routes
app.use(apiRouter.routes()).use(apiRouter.allowedMethods());

// Portal serving
app.use(serve('./public'));
app.use(async (ctx, next) => {
    return send(ctx, 'public/index.html');
});

const dlt = child_process.spawn('npm', ['run', 'start-dlt'], {
    env: {
        NODE_ENV: 'production',
        PATH: process.env.PATH
    }
});

const server = createServer().listen(3000);
const wss = new WebSocketServer({server});

dlt.stdout.setEncoding('ascii');
wss.on('connection', function connection(ws) {
    dlt.stdout.on('data', (data) => {
        process.stdout.write(data);
        ws.send(data);
    });
});


server.on('request', app.callback());

