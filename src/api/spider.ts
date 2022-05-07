import Router from 'koa-router';
import axios from 'axios';

const router: Router = new Router({
    prefix: '/spider',
});

router.get('/set_tokens', async (ctx, next) => {
    const {data} = await axios.post('http://spider:5000/set_tokens', {
        'github_token': 'gho_jeshfuehfhsjfe',
        'libraries_token': 'jdf9328bf87831bfdjs0823'
    });

    ctx.response.body = data;
});

router.get('/test', async (ctx, next) => {
    const {data} = await axios.post('http://spider:5000/get_data', {
        'project_info': {
            'project_platform': 'Pypi',
            'project_owner': 'numpy',
            'project_name': 'numpy',
            'project_release': 'v.1.22.1',
            'project_year': 2021
        },
        'cve_data_points': [
            'cve_count',
            'cve_vulnerabilities',
            'cve_codes'
        ]
    });

    ctx.response.body = data;
});

router.get('/start', (ctx, next) => {
    ctx.response.body = 'Route for starting the spider.';
});

router.get('/stop', (ctx, next) => {
    ctx.response.body = 'Route for stopping the spider.';
});

export default router;
