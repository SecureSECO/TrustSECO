import Router from 'koa-router';
import { getWorker } from '../services/spider-service';

const router: Router = new Router({
    prefix: '/websocket',
});

router.get('/', (ctx, next) => {
    getWorker().on('message', (message) => {
        // @ts-ignore
        ctx.websocket.send(message);
    });
});

export default router;
