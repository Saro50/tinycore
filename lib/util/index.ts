/**
 * 
 */
import {mysql_op} from './mysql'
export let sql_op = mysql_op
import * as long from 'long'
import * as os from 'os'
function getActiveNetWork(){
    let netInfo = os.networkInterfaces()
    for(let network_name in netInfo){
        for(let i =0;i<netInfo[network_name].length;++i){
            if(/ipv4/i.test(netInfo[network_name][i].family)){
                if(!/127/.test(netInfo[network_name][i].address)){
                    return netInfo[network_name][i].address
                }
            }
        }
    }
}

let address = getActiveNetWork()

let cur_node_id = process.pid
    /**
 * uuid,
 * 总计32位,
 * 由machine_id,node_id,module_id
 */
export class SeqId
{
    public machine_id:number
    public node_id:number
    public module_id:number
    public sequence:number
    public fix_id:number
    constructor(module_id:number)
    {
        let node_id = cur_node_id
        let machine_id:number = parseInt(address.replace('\.',''))
        this.machine_id = machine_id%(1<<8)
        this.node_id = node_id%(1<<4)
        this.module_id = module_id%(1<<4)
        var fix_id = this.machine_id*(1<<8) + this.node_id *(1<<4) +this.module_id
        this.fix_id = fix_id
        this.sequence = Math.round(Math.random()* (1<<6) % (1<<6))
    }

    next()
    {
        this.sequence = (this.sequence+1) %(1<<6)

        var now = Date.now()
        var ms = now % 1000
        var seconds = Math.round(now / 1000)

        var low = (ms<<22) + (this.sequence<<16) + this.fix_id
        var seq = new long(low, seconds, true)
        return seq.toString()
    }
}
