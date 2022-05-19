import Router from 'koa-router';
import { getWorker } from '../services/spider-service';

const router: Router = new Router({
    prefix: '/websocket',
});

router.get('/', (ctx, next) => {
    const worker = getWorker();

    worker.on('message', (message) => {
        // @ts-ignore
        ctx.websocket.send(message);
    });

    worker.on('exit', async () => {
        // @ts-ignore
        ctx.websocket.send('Spider has stopped.');
    });
});

export default router;
