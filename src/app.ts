import Koa from 'koa';
import serve from 'koa-static';
import apiRouter from './api';
import * as dlt from 'fides-dlt';

const app = new Koa();

app.use(serve('./public'));
app.use(apiRouter.routes()).use(apiRouter.allowedMethods());

app.listen(3000);

dlt.start();
