import Router from 'koa-router';
import {
    getTokens,
    isRunning, setTokens, startSpider, stopSpider,
} from '../services/spider-service';
import { getGitHubLink } from '../services/dlt-service';

const router: Router = new Router({
    prefix: '/spider',
});

router.post('/set-tokens', async (ctx, next) => {
    ctx.response.body = await setTokens({
        github_token: ctx.request.body.github_token,
        libraries_token: ctx.request.body.libraries_token,
    });
});

router.get('/start', async (ctx, next) => {
    const tokens = await getTokens();

    if (!tokens.github_token || !tokens.libraries_token) {
        ctx.response.status = 400;
        ctx.response.body = {
            success: false,
            message: 'You have not set up your API tokens, please do so in the settings menu.',
        };
        return;
    }

    const githubLink = await getGitHubLink();

    if (!githubLink) {
        ctx.response.status = 400;
        ctx.response.body = {
            success: false,
            message: 'You have not set up your GitHub link, please do so in the settings menu.',
        };
        return;
    }

    startSpider();

    ctx.response.status = 200;
    ctx.response.body = {
        success: true,
        message: 'Successfully started the spider.',
    };
});

router.get('/stop', (ctx, next) => {
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

/* This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
© Copyright Utrecht University (Department of Information and Computing Sciences) */