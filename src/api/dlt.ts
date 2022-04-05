import Router from 'koa-router';

const router: Router = new Router({
  prefix: '/dlt',
});

router.get('/packages', (ctx, next) => {
  ctx.response.body = 'Listing packages';
});

router.get('/package/:id', (ctx, next) => {
  const { id } = ctx.params;
  ctx.response.body = `Showing information for package ${id}`;
});

export default router;
