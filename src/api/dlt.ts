import Router from 'koa-router';
import {
    addJob, getGitHubLink, getJobs, getMetrics, getPackageData, getPackagesData, getTrustFacts, storeGitHubLink,
} from '../services/dlt-service';
import { getKeys } from '../setup';

const router: Router = new Router({
    prefix: '/dlt',
});

router.get('/trust-facts', async (ctx, next) => {
    const { packageName } = ctx.params;
    ctx.response.body = await getTrustFacts(packageName);
});

router.get('/jobs', async (ctx, next) => {
    ctx.response.body = await getJobs();
});

router.get('/get-gpg-key', async (ctx, next) => {
    const { publicKey } = await getKeys();
    ctx.response.body = publicKey;
});

router.get('/get-github-link', async (ctx, next) => {
    ctx.response.body = await getGitHubLink();
});

router.post('/add-job', async (ctx, next) => {
    await addJob(ctx.request.body);
    ctx.response.body = 'Added job.';
});

router.post('/store-github-link', async (ctx, next) => {
    await storeGitHubLink(ctx.request.body.data);
    ctx.response.status = 200;
});

router.get('/packages', async (ctx, next) => {
    ctx.response.body = await getPackagesData();
});

router.get('/package/:id', async (ctx, next) => {
    const { id } = ctx.params;
    ctx.response.body = await getPackageData(id);
});

router.get('/metrics', async (ctx, next) => {
    ctx.response.body = await getMetrics();
});

export default router;
