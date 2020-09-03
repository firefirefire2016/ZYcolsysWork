import { get,post,put,del } from '../utils/request'

/**
 * 获取目标列表
 * @param {*} page 首页页码
 * @param {*} limit 记录数量
 */
export function getList(page=1,limit=200){
    
    return get(`/list/3/${page}/${limit}`);
}

/**
 * 创建目标
 * @param {*} data 数据
 */
export function createTarget(data){
    return post('/create',data);
}

/**
 * 修改目标
 * @param {*} data 目标数据
 */
export function modifyOne(data){
    return put('/update',data);
}


/**
 * 删除目标，修改目标状态为已删除
 * @param {*} data 目标数据
 */
export function delOne(data){
    return del('/update_status',data);
}
