import Router from 'koa-router';
import {
    getTokens,
    isRunning, setTokens, startSpider, stopSpider,
} from '../services/spider-service';

const router: Router = new Router({
    prefix: '/spider',
});

router.post('/set-tokens', async (ctx, next) => {
    ctx.response.body = await setTokens({
        github_token: ctx.request.body.github_token,
        libraries_io_token: ctx.request.body.libraries_io_token,
    });
});

router.post('/start', (ctx, next) => {
    startSpider();
    ctx.response.status = 200;
});

router.post('/stop', (ctx, next) => {
    stopSpider();
    ctx.response.status = 200;
});

router.get('/status', async (ctx, next) => {
    ctx.response.body = isRunning();
});

router.get('/get-tokens', async (ctx, next) => {
    ctx.response.body = await getTokens();
});

export default router;
