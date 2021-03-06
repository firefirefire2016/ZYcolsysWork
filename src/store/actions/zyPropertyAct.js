import React from 'react'
import { getList, modifyOne, createTarget, updateOneStatus } from '../../services/zyService'
import { message, Button, notification, Modal } from 'antd';
import { rentMergeQuery } from '../../utils/common'
import { consoleTarget } from '../../utils/ItemUtils';

const sourceUrl = 'zyProperty';

export const onSelectToContract = async (dispatch, payload) => {

    let { record } = payload;

    console.log(JSON.stringify(record));

    dispatch({
        type: 'TO_Contract',
        payload: { rightno: record }
    })

    // dispatch({
    //     type: 'GET_RIGHTNO',
    //     payload: { rightno: record }
    // })



}


//加载产权列表
export const onLoadTargetListByREQ = async (dispatch, payload) => {

    let { rightno } = payload;

    dispatch({
        type: 'LOADINGRight',
        //payload: { rightno }
    })

    let { page, limit, req } = payload;


    const res = await getList(sourceUrl, page, limit, req);

    let rows = res.rows;

    let total = res.total;

    //let rightnos = res.rows;


    dispatch({
        type: 'GET_ALLRight',
        payload: { page, limit, rows, total,rightno }
    })




}


/**
 * 进入创建产权
 * @param {*} dispatch 
 * @param {*} isCreating 
 */
export const onCreateData = async (dispatch, isCreating) => {


    dispatch({
        type: 'CREATE_ONE',
        payload: { mode: 'editing' }
    })

}

/**
 * 打开详情
 * @param {*} dispatch 
 * @param {*} payload 
 */
export const onShowDetail = async (dispatch, payload) => {
    let { record } = payload;

    let id = record.id;

    dispatch({
        type: 'GET_ONEDETAIL',

        payload: { record, id, mode: 'details' }
    })
}

/**
 * 进入编辑
 * @param {*} dispatch 
 * @param {*} payload 
 */
export const onEditDetail = async (dispatch, payload) => {
    let { record } = payload;

    let id = record.id;

    dispatch({
        type: 'GET_ONEDETAIL',

        payload: { record, id, mode: 'editing' }
    })
}


//提交修改产权状态
export const onCommitUpdateStatus = async (dispatch, payload) => {

    let { id, status, page, limit } = payload;

    await updateOneStatus(sourceUrl, payload).then(async function (res) {


        if (res.code === 0) {
            message.info(res.msg);
        }
        else {
            message.warn('失败:' + res.msg);
        }

        dispatch({
            type: 'COMMIT_Edit',

            payload: { res }

        })

    })
}


/**
 * 提交修改产权
 * @param {*} dispatch 
 * @param {*} payload record,page,limit
 */
export const onCommitEdit = async (dispatch, payload) => {

    let { record, edittype } = payload;

    await modifyOne(sourceUrl, record).then(async function (res) {

        if (res.code === 0) {
            message.info(res.msg);
        }
        else {
            message.warn('失败:' + res.msg);
        }

        switch (edittype) {
            case 'COMMIT_Edit':
                dispatch({
                    type: edittype,

                    payload: { res }

                })
                break;
            default:
                dispatch({
                    type: 'COMMIT_Edit',

                    payload: { res }

                })
                break;
        }


    })
}

/**
 * 提交创建产权
 * @param {*} dispatch 
 * @param {*} payload record,page,limit
 */
export const onCommitCreate = async (dispatch, payload) => {

    let { record } = payload;

    console.log('record' + JSON.stringify(record));

    await createTarget(sourceUrl, record).then(async function (res) {

        console.log('res' + JSON.stringify(res));

        if (res.code === 0) {
            message.info(res.msg);
            dispatch({
                type: 'COMMIT_CREATE',

                payload: { res }
            })
        }
        else {
            message.warn('失败:' + res.msg);
        }



    })


}



export const onfetchContract = async(dispatch,payload)=>{

    dispatch({
        type:'FETCHING_Contract',
    })

    let { billno } = payload;

    let _sourceUrl = 'zyCollection';

    await getList(_sourceUrl,0,0,{billno}).then(async function(res){
        dispatch({
            type: 'FETCHED_Contract',
            payload: { data:res.rows }
        })
    });

}



