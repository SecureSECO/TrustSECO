import Router from 'koa-router';
import {
    addJob, getGitHubLink, getJobs, getTrustFacts, storeGitHubLink,
} from '../services/dlt-service';
import { getKeys } from '../setup';

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

router.get('/get-gpg-key', async (ctx, next) => {
    const { publicKey } = await getKeys();
    ctx.response.body = publicKey;
});

router.get('/get-github-link', async (ctx, next) => {
    ctx.response.body = await getGitHubLink();
});

router.post('/add-job', async (ctx, next) => {
    await addJob(ctx.body);
    ctx.response.body = 'Added job.';
});

router.post('/store-github-link', async (ctx, next) => {
    await storeGitHubLink(ctx.body);
    ctx.response.status = 200;
});

export default router;
