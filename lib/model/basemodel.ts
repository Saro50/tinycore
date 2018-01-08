import { sql_op } from "../util"

export class BaseModel<T> {
    public table: string = ''
    constructor(opts:ModelNewParams) {
        this.table = opts.table
    }
    async insert(data:any) {
        return sql_op.insert(this.table,data)
    }
    async get(wheres: MysqlWhereObject = {},fields:string[]):Promise<T[]> {
        return sql_op.get(this.table,wheres,fields) 
    }
    async query(qstr:string,params:MysqlWhereObject){
        console.log(qstr)
        return sql_op.exec_sql(qstr,params)
    }
    async del(wheres:MysqlWhereObject){
        return sql_op.del(this.table,wheres)
    }
    async update(sets:object,wheres:MysqlWhereObject){
        return sql_op.update(this.table,sets,wheres)
    }
}