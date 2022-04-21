import Router from 'koa-router';

const router: Router = new Router({
  prefix: '/spider',
});

router.get('/start', (ctx, next) => {
  ctx.response.body = 'Route for starting the spider.';
});

router.get('/stop', (ctx, next) => {
  ctx.response.body = 'Route for stopping the spider.';
});

export default router;
