import Router from 'koa-router';
import { getQueueEmitter, getHeapSize } from '../services/queue-service';
import { getSpiderEmitter } from '../services/spider-service';

const router: Router = new Router({
    prefix: '/websocket',
});

router.get('/', (ctx, next) => {
    getSpiderEmitter().on('info', (message) => {
        // @ts-ignore
        ctx.websocket.send(message);
    });
});

router.get('/get-queue-size', (ctx, next) => {
    // @ts-ignore
    ctx.websocket.send(`test${getHeapSize()}`);

    getQueueEmitter().on('pushed', (data) => {
        // @ts-ignore
        ctx.websocket.send(data);
    });
});

export default router;
