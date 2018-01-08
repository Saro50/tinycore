import * as router from 'koa-joi-router'
import { readdirSync } from 'fs'
import * as path from 'path'
const ROUTER_PATH = path.resolve(__dirname, '..', '..', 'router')


export function make_router() {
    let files = readdirSync(ROUTER_PATH),
        routers: any[] = [],
        joi_router: any = router()
    for (let i = 0; i < files.length; ++i) {
        let config: any[] = require(path.resolve(ROUTER_PATH, files[i]))

        /**
         * 使用当前文件名作为二级路径
         */
        for (let j = 0; j < config.length; ++j) {
                config[j].path = '/' + path.basename(files[i], '.js') + config[j].path
                routers.push(config[j])
        }
    }
    joi_router.route(routers)
    return joi_router
}

/**
 * {
 *     method: 'get',
 *     path: '/do/stuff/:id',
 *     handler: function *(next){},
 *     validate: {
 *       header: Joi object
 *       params: Joi object (:id)
 *       query: Joi object (validate key/val pairs in the querystring)
 *       body: Joi object (the request payload body) (json or form)
 *       maxBody: '64kb' // (json, x-www-form-urlencoded only - not stream size)
 *                       // optional
 *       type: 'json|form|multipart' (required when body is specified)
 *       failure: 400 // http error code to use
 *     },
 *     meta: { // this is ignored but useful for doc generators etc
 *       desc: 'We can use this for docs generation.'
 *       produces: ['application/json']
 *       model: {} // response object definition
 *     }
 *   }
 */


