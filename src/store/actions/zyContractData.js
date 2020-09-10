import { getList, createTarget, modifyOne, delOne } from '../../services/zyService'
import store from '../store';
import { message } from 'antd';

//const zyContractData = store.getState().zyContractData;

export const loadContractData = payload => async dispatch => {
    console.log(payload);
    //console.log(dispatch);
    let { page, limit } = payload;
    const res = await getList(page, limit);

    dispatch({
        type: 'GET_ALL',
        payload: { ...res, page, limit }
    })

}

//加载列表数据，推送到reducer
export const onLoadContractData = async (dispatch, payload) => {

    let { page, limit } = payload;


    const res = await getList(page, limit);

    //console.log(dispatch);

    dispatch({
        type: 'GET_ALL',
        payload: { ...res, page, limit }
    })


}



export const onGetEditData = async (dispatch, payload) => {
    let { record } = payload;

    dispatch({
        type: 'GET_ONE',
        payload: { record }
    })

}

export const onCreateData = async (dispatch, isCreating) => {
    //let {record} = payload;

    console.log(isCreating);

    dispatch({
        type: 'CREATE_ONE'
    })

}

/**
 * 提交更改合同
 * @param {*} dispatch 
 * @param {*} payload record,page,limit
 */
export const onCommitEdit = async (dispatch, payload) => {

    let { record, page, limit } = payload;

    await modifyOne(record).then(async function (result) {

        await getList(page, limit).then(function(res){
            dispatch({
                type: "COMMIT_Edit",
                payload: { ...res, record,result}
            })
            console.log(res);
            if(result.code === 0){
                message.info(result.msg);
            }
            else{
                message.warn('修改提交失败');
            }
        }

        )

        
        
    })
}

/**
 * 提交创建合同
 * @param {*} dispatch 
 * @param {*} payload record,page,limit
 */
export const onCommitCreate = async (dispatch, payload) => {

    let { record, page, limit } = payload;

    await createTarget(record).then(async function (result) {

        await getList(page, limit).then(function(res){
            dispatch({
                type: "COMMIT_CREATE",
                payload: { ...res, record,result}
            })
            console.log(res);
            if(result.code === 0){
                message.info(result.msg);
            }
            else{
                message.warn('创建合同失败');
            }
        }

        )

        
        
    })



}




//初始化列表数据，同时获取提醒数据
export const onInit = async (dispatch, payload) => {

}

