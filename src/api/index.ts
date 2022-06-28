import Router from 'koa-router';
import dltRouter from './dlt';
import spiderRouter from './spider';
import { clearQueue } from '../services/queue-service';

const router: Router = new Router({
    prefix: '/api',
});

router.use(dltRouter.routes());
router.use(spiderRouter.routes());

router.get('/', (ctx, next) => {
    const routes = router.stack.map((route) => route.path).sort().join('\n');
    ctx.response.body = `Main entry point for api. Available routes: \n${routes}`;
});

router.get('/download', (ctx, next) => {
    ctx.response.body = 'https://github.com/Fides-UU/TrustSECO-CoSy';
});

router.get('/clear-queue', (ctx, next) => {
    clearQueue();
    ctx.response.body = 'Queue has been cleared.';
});

export default router;

/* This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
© Copyright Utrecht University (Department of Information and Computing Sciences) */