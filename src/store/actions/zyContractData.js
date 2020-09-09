import { getList, createTarget, modifyOne, delOne } from '../../services/zyService'
import store from '../store';

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

    let { record } = payload;

    let result;

    await modifyOne(record).then(function (res) {

        result = res;
        //console.log(result);
        dispatch({
            type: "COMMIT_Edit",
            payload: { record, result }
        })
    })




}

/**
 * 提交创建合同
 * @param {*} dispatch 
 * @param {*} payload record,page,limit
 */
export const onCommitCreate = async (dispatch, payload) => {

    let { record } = payload;

    let result;

    await createTarget(record).then(function (res) {

        result = res;

        record = result.data;

        dispatch({
            type: "COMMIT_CREATE",
            payload: { record, result }
        })
    })



}




//初始化列表数据，同时获取提醒数据
export const onInit = async (dispatch, payload) => {

}

