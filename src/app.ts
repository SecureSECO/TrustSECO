import Koa from 'koa';
import serve from 'koa-static';
import apiRouter from './api';

const app = new Koa();

app.use(serve('./public'));
app.use(apiRouter.routes()).use(apiRouter.allowedMethods());

app.listen(3000);
