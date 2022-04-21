import Router from 'koa-router';
import dltRouter from './dlt';
import spiderRouter from './spider';

const router: Router = new Router({
  prefix: '/api',
});

router.use(dltRouter.routes());
router.use(spiderRouter.routes());

router.get('/', (ctx, next) => {
  const routes = router.stack.map((route) => route.path).sort().join('\n');
  ctx.response.body = `Main entry point for api. Available routes: \n${routes}`;
});

router.get('/download', (ctx, next) => {
  ctx.response.body = 'Endpoint for downloading the software package.';
});

export default router;
