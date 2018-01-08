/**
 * 
 */

declare const enum SwitchValue {
    OFF, ON
}

declare const enum MyError{
    MySql_Connection_Error,
    Mysql_Query_Error,
    Wx_Auth_Error,
    Wx_Auth_Parse_Error,
    Params_Error,
    Invalid_Operator_Error,
    Server_Error
}
interface TypeError extends Error{
    type?:MyError,
    retcode?:number
}

interface ModelBase {
    insert(data: object): Promise<any>
    get(data: object, fields: Array<string>): Promise<any>
    query(query_str: string): Promise<any>
    del(data: object): Promise<any>
    update(data: object): Promise<any>
}
interface QueryFunction {
    (query: string, data: object): Promise<any>
}

interface MysqlWhereObject {
    [name: string]:any
}
interface MySqlInsert {
    (table: string, data:object ): Promise<any>
}
interface MySqlGet {
    (table: string, wheres: MysqlWhereObject, fields: string[]): Promise<any>
}
interface MySqlUpdate {
    (table: string, sets: object, where: MysqlWhereObject): Promise<any>
}
interface MysqlDel {
    (table: string, wheres: MysqlWhereObject): Promise<any>
}
interface MysqlExec {
    (query_str: string, params: MysqlWhereObject): Promise<any>
}
interface MysqlSqlFn {
    insert: MySqlInsert,
    get: MySqlGet,
    update: MySqlUpdate,
    exec_sql: MysqlExec,
    del: MysqlDel
}
interface ModelNewParams {
    table: string,
    pkey?:string
}

interface RouterInputValidateParams {
    header?: object,
    params?: object,
    query?: object,
    body?: object,
    maxBody?: string,
    type?: string,
    continueOnError?: SwitchValue,
    faiure?: number
}

interface RouterMetaParams {
    desc: string,
    produces: string[],
    model: object
}

interface RouterParams {
    method: string,
    path: string,
    handler: Function|Array<Function>,
    validate?: RouterInputValidateParams,
    meta?: RouterMetaParams
}

