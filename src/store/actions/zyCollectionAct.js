import React from 'react'
import { getList, modifyOne, createTarget,getMergeList } from '../../services/zyService'
import { message, Button, notification, Modal } from 'antd';
import { rentMergeQuery } from '../../utils/common'
import { consoleTarget } from '../../utils/ItemUtils';
//import Modal from 'antd/lib/modal/Modal';
//import { sourceUrl } from '../../utils/request';

//const zyContractData = store.getState().zyContractData;

const sourceUrl = 'zyCollection';


export const RentToMergeData = async (dispatch, payload) => {

    dispatch({
        type: 'LOADING',
    })

    let { page, limit, req } = payload;

    let { isInit } = payload.req;

    console.log('req:' + JSON.stringify(req));

    let _isInit = isInit;

    const res = await getMergeList(sourceUrl, page, limit, req);

    

    //加载数据需要合并分析
    let newList = res.newList;
    //遍历每月账单，合并一起

    console.log("newList:" + JSON.stringify(newList) );



    

    dispatch({
        type: 'MERGE_ALL',
        payload: { ...res, page, limit, newList }
    })


}

export const onLoadTargetRent = async (dispatch, payload) => {

    let { record } = payload;

    let contractid = record.contractid;

    dispatch({
        type: 'EDIT_ON',
        payload: { record, contractid }
    })
}

const NoticeStart = (rows, isInit) => {
    //let temps = new Object(rows);
    let warnArray = [];
    var contractSum = [0];
    var notices = [];
    rows.forEach((row, index, rows) => {
        row['contractno'] = row.zycontract.contractno;
        row['isWarn'] = 0;
        //如果已收金额小于应收金额，则提醒
        //console.log(' 差额：' + (row.amount_received < row.amount_receivable)); 

        let invoice_amount = parseFloat(row.invoice_amount);
        let amount_received = parseFloat(row.amount_received);
        let amount_receivable = parseFloat(row.amount_receivable);

        let date = new Date();
        let currentYear = date.getFullYear();

        let currentMonth = date.getMonth() + 1;

        //console.log('当前月份为' + currentMonth + '当前年份为' + currentYear);

        let yearInt = parseInt(row.year);

        let monthInt = parseInt(row.month);

        if ((amount_received < amount_receivable || invoice_amount < amount_receivable) && row.contract_status === 1) {
            if (yearInt < currentYear) {
                row.isWarn = 1;
            }
            else if (yearInt === currentYear && monthInt <= currentMonth) {
                row.isWarn = 1;
            }
            else {
                row.isWarn = 0;
            }

        }



        if (row.isWarn === 1 && isInit) {
            // var noticecontent = '合同编号为' + row.contractno + '的' + row.year + '年' + row.month +
            //     '月份的租金未收齐，请留意!';            

            var key = row.contractid;

            var notice = {};
            notice.id = key;

            var hasNotice = false;

            for (let index = 0; index < notices.length; index++) {
                // console.log('notice.id:' + notice.id)
                // console.log('key:' + key)
                if (notices[index].id === key) {
                    hasNotice = true;
                }

            }

            if (!hasNotice) {
                var noticecontent = '合同编号为' + row.contractno + '的租金有未收齐或发票未完成的情况，请留意！';
                notice.content = noticecontent;

                notices.push(notice);
            }

            var info = '';

            if (amount_received < amount_receivable && invoice_amount < amount_receivable) {
                info = row.year + '年' + row.month + '月份的租金目前只收到' + row.amount_received +
                    '，仍拖欠' + (row.amount_receivable - row.amount_received) + '元，发票也未完成<br/>';
            }
            else if (invoice_amount < amount_receivable) {
                info = row.year + '年' + row.month + '月份的发票未完成<br/>';
            }
            else if (amount_received < amount_receivable) {
                info = row.year + '年' + row.month + '月份的租金目前只收到' + row.amount_received +
                    '，仍拖欠' + (amount_receivable - amount_received) + '元<br/>';
            }


            if (!contractSum.includes(row.contractid)) {
                contractSum.push(row.contractid);
                let temp = {};
                temp.title = '合同编号为' + row.contractno + '的情况如下:';
                temp.contractid = row.contractid;
                temp.detail = info;
                warnArray.push(temp);
            }

            warnArray.forEach((warn, index, warns) => {
                if (warn.contractid === row.contractid) {
                    warn.detail += info;
                    return;
                }

            })
        }

    });


    let time = 1;
    notices.forEach((notice, index, nos) => {
        warnArray.forEach((warn, index, warns) => {
            if (notice.id === warn.contractid) {
                openNotification('账单提醒', notice.content, warn.title, warn.detail, 'warning', time);
                time = time + 0.5;
                return;
            }
        })

    })
}

//加载账单详情列表
export const onLoadTargetListByREQ = async (dispatch, payload) => {

    dispatch({
        type: 'LOADING',
    })

    let { page, limit, req } = payload;

    let { isInit } = req;

    let _isInit = isInit;

    console.log(req);

    const res = await getList(sourceUrl, page, limit, req);

    let rows = res.rows;

    NoticeStart(rows, _isInit);

    let newList = [];

    rows.forEach((row, index, rows) => {
        let invoice_amount = parseFloat(row.invoice_amount);
        let amount_received = parseFloat(row.amount_received);
        let amount_receivable = parseFloat(row.amount_receivable);
        let invoice_limit = parseFloat(row.invoice_limit);

       // row.simpleaddress = row.zycontract.zypropertyright.simpleaddress;
        row.rentdate = parseInt(row.zycontract.rentdate);
        row.contractno = row.zycontract.contractno;

        if (invoice_amount < invoice_limit || amount_received < amount_receivable) {
            row.isWarn = 1;
        }

        newList.push(row);
    })

    let total = res.total;

    dispatch({
        type: 'GET_TARGETLIST',
        payload: { page, limit, newList, total }
    })

}



//弹窗欠款提醒
const openNotification = (title, description, modaltitle, detail, type, time) => {
    //const key = `open${Date.now()}`;
    const btn = (
        // eslint-disable-next-line react/react-in-jsx-scope
        <Button type="primary" size="small" onClick={async () => {
            //console.log(detail);
            detailInfo(modaltitle, detail);
        }}
        >
            查看详情
        </Button>
    );

    const close = () => {
        // console.log(
        //     '提醒欠款栏关闭.',
        // );
    };

    notification[type]({
        message: title,
        description,
        btn,
        duration: time,
        //key,
        onClose: close,
    });
};

function detailInfo(title, content) {
    Modal.info({
        title,
        content: (<div dangerouslySetInnerHTML={{ __html: content }} />),
        onOk() { },
        okText: '好的'
    });
}

export const onCreateData = async (dispatch, isCreating) => {


    dispatch({
        type: 'CREATE_ONE',
      //  payload: { res }
    })

}

export const onShowDetail = async (dispatch, payload) => {
    let { record } = payload;

    let id = record.id;

    dispatch({
        type: 'GET_ONEDETAIL',

        payload: { record, id, mode: 'details' }
    })
}

export const onEditDetail = async (dispatch, payload) => {
    let { record } = payload;

    let id = record.id;

    dispatch({
        type: 'GET_ONEDETAIL',

        payload: { record, id, mode: 'editing' }
    })
}

/**
 * 提交修改账单
 * @param {*} dispatch 
 * @param {*} payload record,page,limit
 */
export const onCommitEdit = async (dispatch, payload) => {

    let { record, edittype } = payload;

    console.log(JSON.stringify(record));

    await modifyOne(sourceUrl, record).then(async function (res) {

        if (res.code === 0) {
            message.info(res.msg);
            // props.history.push('/admin/zyRentDetailList');
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
            case 'COMMIT_GetRent':
                dispatch({
                    type: edittype,

                    payload: { res }

                })
                break;
            case 'COMMIT_GetInvoice':
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
 * 提交创建合同
 * @param {*} dispatch 
 * @param {*} payload record,page,limit
 */
export const onCommitCreate = async (dispatch, payload) => {

    let { record } = payload;


    await createTarget(sourceUrl, record).then(async function (res) {


        if (res.code === 0) {
            message.info(res.msg);
            //props.history.push('/admin/zyRentDetailList');
        }
        else {
            message.warn('失败:' + res.msg);
            //props.history.push('/admin/zyRentDetailList');
        }

        dispatch({
            type: 'COMMIT_CREATE',

            payload: { res }
        })

    })


}





