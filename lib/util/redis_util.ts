
import { redisCmd } from './redis'

interface ReloadKeyMap {
    [name: string]: boolean
}

let first_reload_key: ReloadKeyMap = {}
const PRE = 'pre_key:'


function get_cache_key(key: string) {
    return PRE + key
}


export class AutoIncrementSet {
    public key: string
    public ready: boolean
    public start: number
    public need_reload: boolean
    constructor(opts: any) {
        this.start = opts.start || 0
        this.key = get_cache_key(opts.key)
        this.ready = false
        if (!first_reload_key[this.key]) {
            this.need_reload = true
            first_reload_key[this.key] = true
        }
    }
    async sync(sourcep: Function) {
        let that = this

        let data = await redisCmd('exists', this.key)
        if (!that.need_reload) {
            that.ready = true
            return data
        } else {
            let sourepData = await sourcep()
            let setData = await redisCmd('set', that.key, sourepData)
            that.ready = true
            return setData
        }
    }
    /**
     * [increase 自增]
     * @return {[type]} [description]
     */
    async increase(increase: number) {
        if (!this.ready) {
            throw new Error('AutoIncrementSet not ready')
        }
        if (!increase) {
            increase = 1
        }
        return await redisCmd('incrby', this.key, increase)
    }
}


export interface TempCacheNewParam {
    pre:number 
}

export class TempCache {
    public pre: string
    constructor(props: TempCacheNewParam) {
        this.pre = props.pre + 'pre:';
    }
    async _commonWrap<T>(key: string, cmd: string, ...args: any[]) {
        let skey = get_cache_key(this.pre + key)
        return await redisCmd<T>(cmd, skey, ...args)
    }
    async setex(key: string, expires: number, value: number | string) {

        return await this._commonWrap<number>(key, 'setex', expires, value)
    }
    async exists(key: string) {
        return await this._commonWrap<number>(key, 'exists')
    }
    async del(key: string) {
        return await this._commonWrap<number>(key, 'del')
    }
    async get(key: string) {
        return await this._commonWrap<number>(key, 'get')
    }
    async increase(key: string, increase: number = 1 ) {
        return await this._commonWrap<number>(key, 'incrby', increase)
    }
    async decr(key:string){
        return await this._commonWrap<number>(key,'decr')
    }
    async incrby(key:string,step:number){
        return await this._commonWrap<number>(key,'incrby',step)
    }
}