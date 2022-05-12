import Router from 'koa-router';
import axios from 'axios';

const router: Router = new Router({
    prefix: '/spider',
});

const SPIDER_ENDPOINT = process.env.NODE_ENV === 'development' ? 'http://localhost:5000/' : 'http://spider:5000/';

router.post('/set_tokens', async (ctx, next) => {
    const { data } = await axios.post(`${SPIDER_ENDPOINT}/set_tokens`, {
        github_token: 'gho_jeshfuehfhsjfe',
        libraries_token: 'jdf9328bf87831bfdjs0823',
    });

    ctx.response.body = data;
});

router.post('/get_data', async (ctx, next) => {
    const { data } = await axios.post(`${SPIDER_ENDPOINT}/get_data`, ctx.request.body);
    ctx.response.body = data;
});

router.get('/start', (ctx, next) => {
    ctx.response.body = 'Route for starting the spider.';
});

router.get('/stop', (ctx, next) => {
    ctx.response.body = 'Route for stopping the spider.';
});

export default router;
