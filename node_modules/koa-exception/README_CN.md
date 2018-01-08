# koa-exception

这是一个基于 `koa@1.x` 的异常处理中间件.

# 安装

进入 `nodejs` 项目根目录执行:

```
npm install koa-exception --save
```

# 用例

app.js

```
var app = require('koa')();
var KoaEx = require('koa-exception');

/**
*   注意: 
*       koa-exception 中间件必须要在`app`对象创建完成后,
*       第一个被加载的中间件,否则在其前面使用的中间件抛出的异常将不会被捕获!
*/
app.use(KoaEx('CN'));

var port = 3000;
app.listen(port, function() {
  console.log('Server running on port ' + port);
});
```

> `CN` 参数可以不传,默认为英文提示信息,传入 `CN` 则会返回给你中文信息.

# 功能

`koa-exception` 作为 `koa`的中间件,用于捕获路由,数据库操作,网络客户端请求等抛出的异常信息,

与前端的交互,所有数据基于`json`格式, 安全认证基于`token`, 当用户的`token`过期或者没有登录时,

请抛出一个 name 为 `token_error` 的异常,`koa-exception` 会捕获,并返回客户端

一个 `{"code": 302, "msg":"你抛出的异常信息"}`, 用 `code`为 `302` 是沿用 `http` 标准的

状态码,寓意登录信息已经失效,需要重定向至登录页面. 
