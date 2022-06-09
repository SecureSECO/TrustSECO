"use strict";
exports.__esModule = true;
var koa_router_1 = require("koa-router");
var dlt_1 = require("./dlt");
var spider_1 = require("./spider");
var router = new koa_router_1["default"]({
    prefix: '/api'
});
router.use(dlt_1["default"].routes());
router.use(spider_1["default"].routes());
router.get('/', function (ctx, next) {
    var routes = router.stack.map(function (route) { return route.path; }).sort().join('\n');
    ctx.response.body = "Main entry point for api. Available routes: \n".concat(routes);
});
router.get('/download', function (ctx, next) {
    ctx.response.body = 'https://github.com/Fides-UU/TrustSECO-CoSy';
});
exports["default"] = router;
