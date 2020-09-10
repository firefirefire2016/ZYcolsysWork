import { get,post,put,del } from '../utils/request'

/**
 * 获取目标列表
 * @param {*} page 首页页码
 * @param {*} limit 记录数量
 */
export function getList(url,page,limit,req){
    //return get(`/list/3/${page}/${limit}`);
    return get(url + '/list/3/' + page +'/' + limit,{page,limit},req);
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
export function delOne(url,data){
    return del(url + '/update_status',data);
}
