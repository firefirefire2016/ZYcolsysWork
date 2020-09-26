import { get,post,put,del } from '../utils/request'

/**
 * 获取目标列表
 * @param {*} page 首页页码
 * @param {*} limit 记录数量
 */
export function getList(url,page,limit,req){
    //return get(`/list/0/${page}/${limit}`);
    //http://192.168.0.222:4000/zyCollection/list/:page/:limit
    return get(url + '/list/' + page +'/' + limit,{page,limit},req);
}

/**
 * 获取汇总列表
 * @param {*} page 首页页码
 * @param {*} limit 记录数量
 */
export function getMergeList(url,page,limit,req){
    //return get(`/list/0/${page}/${limit}`);
    //http://192.168.0.222:4000/zyCollection/list/:page/:limit
    return get(url + '/mergelist/' + page +'/' + limit,{page,limit},req);
}

/**
 * 创建目标
 * @param {*} data 数据
 */
export function createTarget(url,data){
    return post(url + '/create',data);
}

/**
 * 修改目标
 * @param {*} data 目标数据
 */
export function modifyOne(url,data){
    return put(url + '/update',data);
}


/**
 * 删除目标，修改目标状态为已删除
 * @param {*} data 目标数据
 */
export function updateOneStatus(url,data){
    return del(url + '/update_status',data);
}

/**
 * 根据合同删除收款目标，修改目标状态
 * @param {*} data 目标数据
 */
export function updateALLStatus(url,data){
    return del(url + '/delbyContract',data);
}
