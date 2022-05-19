import Router from 'koa-router';
import {
    isRunning, setTokens, startSpider, stopSpider,
} from '../services/spider-service';

const router: Router = new Router({
    prefix: '/spider',
});

router.post('/set_tokens', async (ctx, next) => {
    ctx.response.body = await setTokens({
        github_token: ctx.body.github_token,
        libraries_io_token: ctx.body.libraries_io_token,
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

export default router;
