import Router from 'koa-router';
import {getJobs, getTrustFacts} from "../services/dlt-service";

const router: Router = new Router({
    prefix: '/dlt',
});

router.get('/get-trustfacts', async (ctx, next) => {
    ctx.response.body = await getTrustFacts();
});

router.get('/jobs', async (ctx, next) => {
    ctx.response.body = await getJobs();
});

router.get('/package/:id', (ctx, next) => {
    const {id} = ctx.params;
    ctx.response.body = `Showing information for package ${id}`;
});

export default router;
