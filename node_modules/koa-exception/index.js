// 异常统一处理器: 捕获业务代码抛出的异常,用户也可自己手动捕获异常,手动捕获后将不会被该处理器处理.
module.exports = function (locale) {
    return function* (next) {
        var _locale = locale || 'EN';
        var msg;
        var code = 500;
        try {
            yield next;
        } catch (e) {
            console.error('---> Global Exception Handler: \x1b[31m%s\x1b[0m => %s\n%s', e.name, e.message, e.stack);
            msg = e.message;

            if (e.name == "token_error") {
                code = 302;
            } else if (e.name == "access_denied") {
                code = 403;
            } else if (["login_error", "checkcode_error", "Error"].indexOf(e.name) > -1) {
                // Do nothing. Just output origin message.
            } else {
                // internationalization
                switch (_locale) {
                    case 'CN':
                        msg = "操作失败,系统异常!";
                        break;
                    case 'EN':
                        msg = "Oops, system is busy now!";
                        break;
                    default:
                        msg = "Oops, system is busy now!";
                        break;
                }
            }

        } finally {
            if (msg) {
                this.body = { code: code, msg: msg };
            }
        }
    }
}