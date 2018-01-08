import { createClient} from 'redis'
import { createPool,Factory } from 'generic-pool'

import { redis_config } from '../../config/config'

const factory:Factory<any> = {
    create: function () {
        return new Promise(function (resolve) {
            var client = createClient({
                'host': redis_config.host, 'port': redis_config.port, 'password': redis_config.password,
                'no_ready_check': true //集群禁止了INFO命令字.ready_check过不去
            })
            resolve(client)
            console.info('redis client connected')
        })
    },

    destroy: function (client:any) {
        return new Promise(function (resolve) {
            console.info('redis client disconnect')
            resolve()
            client.disconnect()
        })
    }
}

let opts = {
    max: redis_config.max, // maximum size of the pool
    min: redis_config.min // minimum size of the pool
}


let redisPool = createPool(factory, opts)

let myPool = {
    acquireResource: function () {
        return redisPool.acquire().then(function (client:any) {
            return client
        })
    },
    releaseResource: function (client:any) {
        redisPool.release(client)
    }
}

export function redisCmd<T>(cmd:string, ...args:any[]):Promise<T> {
    return new Promise(function(resolve,reject){
        myPool.acquireResource().then(function(client) {
            client[cmd](...args, function(err:any,data:any){
                myPool.releaseResource(client);
                if(err){
                    reject(err);
                }else{
                    resolve(data);
                }
            });
        });
    });
}
