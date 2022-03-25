import Koa from 'koa';
import serve from 'koa-static';

const app = new Koa();

app.use(serve('./public'));

app.listen(3000);
