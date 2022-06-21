import Router from 'koa-router';
import { getEmitter, getHeapSize } from '../services/queue-service';

const router: Router = new Router({
    prefix: '/websocket',
});

router.get('/', (ctx, next) => {
    // TODO: Rework
});

router.get('/get-queue-size', (ctx, next) => {
    // @ts-ignore
    ctx.websocket.send(`test${getHeapSize()}`);

    getEmitter().on('pushed', (data) => {
        // @ts-ignore
        ctx.websocket.send(data);
    });
});

export default router;
