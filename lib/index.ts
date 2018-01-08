import { sql_op } from "./util"
import { make_router } from './router/router_maker'
import { BaseModel } from "./model/basemodel";



export let router = { init: make_router }
export let mysql_op = sql_op
export let ModelClass = BaseModel



export function throwError(msg: string, ret: MyError | number = MyError.Server_Error ) {
    let err: TypeError = new Error(msg)
    if (ret < 100) {
        err.type = ret
    } else {
        err.retcode = ret
    }
    throw err
}