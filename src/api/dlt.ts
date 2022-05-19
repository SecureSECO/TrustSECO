import Router from 'koa-router';
import { addJob, getJobs, getTrustFacts } from '../services/dlt-service';

const router: Router = new Router({
    prefix: '/dlt',
});

router.get('/trust-facts', async (ctx, next) => {
    const { packageName } = ctx.query;
    ctx.response.body = await getTrustFacts(<string>packageName);
});

router.get('/jobs', async (ctx, next) => {
    ctx.response.body = await getJobs();
});

router.post('/add-job', async (ctx, next) => {
    await addJob(ctx.body);
    ctx.response.body = 'Added job.';
});

/* router.get('/package/:id', (ctx, next) => {
    const { id } = ctx.params;
    ctx.response.body = `Showing information for package ${id}`;
}); */

export default router;
