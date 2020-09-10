import { getList, createTarget, modifyOne, delOne } from '../../services/zyService'
import store from '../store';
import { message } from 'antd';
//import { sourceUrl } from '../../utils/request';

//const zyContractData = store.getState().zyContractData;

const sourceUrl = 'zyCollection';


//加载列表数据，推送到reducer
export const onLoadContractData = async (dispatch, payload) => {

    console.log('payload = ' + JSON.stringify(payload));

    let { page, limit } = payload;

    const res = await getList(sourceUrl,page, limit, {  });


    dispatch({
        type: 'GET_ALL',
        payload: { ...res, page, limit }
    })


}



export const onEditData = async (dispatch, payload) => {
    let { record } = payload;

    dispatch({
        type: 'EDIT_ON',
        payload: { record }
    })

}

export const onCreateData = async (dispatch, isCreating) => {

    console.log(isCreating);

    dispatch({
        type: 'CREATE_ON'
    })

}

/**
 * 提交修改账单
 * @param {*} dispatch 
 * @param {*} payload record,page,limit
 */
export const onCommitEdit = async (dispatch, payload) => {

    let { record, page, limit } = payload;

    await modifyOne(sourceUrl,record).then(async function (result) {

        await getList(sourceUrl,page, limit).then(function (res) {
            dispatch({
                type: "COMMIT_Edit",
                payload: { ...res, record, result }
            })
            console.log(res);
            if (result.code === 0) {
                message.info(result.msg);
            }
            else {
                message.warn('修改提交失败');
            }
        }

        )



    })
}




