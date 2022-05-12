import Router from 'koa-router';
import { setTokens, startSpider, stopSpider } from '../services/spider-service';

const router: Router = new Router({
    prefix: '/spider',
});

router.post('/set_tokens', async (ctx, next) => {
    ctx.response.body = await setTokens({
        github_token: ctx.body.github_token,
        libraries_io_token: ctx.body.libraries_io_token,
    });
});

router.get('/start', (ctx, next) => {
    startSpider();
    ctx.response.body = 'Spider has been started.';
});

router.get('/stop', (ctx, next) => {
    stopSpider();
    ctx.response.body = 'Spider has been stopped.';
});

export default router;
