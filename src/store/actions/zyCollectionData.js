import React from 'react'
import { getList, modifyOne } from '../../services/zyService'
import { message, Button, notification, Modal } from 'antd';
import { rentMergeQuery } from '../../utils/common'
//import Modal from 'antd/lib/modal/Modal';
//import { sourceUrl } from '../../utils/request';

//const zyContractData = store.getState().zyContractData;

const sourceUrl = 'zyCollection';


export const RentToMergeData = async (dispatch, payload) => {

    //console.log('payload = ' + JSON.stringify(payload));

    let { page, limit, isInit, tenant, month_rent, isOwe, needInvoice } = payload;

    //let req = {};

    let _isInit = isInit;

    const res = await getList(sourceUrl, page, limit, { month_rent });

    let newList = [];

    //加载数据需要合并分析
    let rows = res.rows;
    //遍历每月账单，合并一起

    //console.log("payload:" + JSON.stringify(payload) );

    //let obj = new Object(payload);



    NoticeStart(rows, _isInit);





    let contracts = [];

    //console.log(' res.rows = ' + rows)



    rows.forEach((row, index, rows) => {
        let invoice_amount = parseFloat(row.invoice_amount);
        let amount_received = parseFloat(row.amount_received);
        let amount_receivable = parseFloat(row.amount_receivable);
        if (!contracts.includes(row.contractid)) {
            console.log(' id = ' + row.contractid)
            contracts.push(row.contractid);



            let item = {
                contractid: row.contractid,
                contractno: row.zycontract.contractno,
                tenant: row.zycontract.tenant,
                rentdate: row.zycontract.rentdate,
                totalAmount: amount_received,
                isOwe: 0,//是否有欠租
                needInvoice: 0,//有发票未完成
                month_rent: row.zycontract.month_rent,
                //totalAmount_receivable:row.amount_receivable,//总应收款
                //totalAmount_invoice:row.invoice_amount//总开票
                isWarn: 0
            }

            if (amount_received < amount_receivable) {
                item.isOwe = 1;
                item.isWarn = 1;
            }

            if (invoice_amount < amount_receivable) {
                item.needInvoice = 1;
                item.isWarn = 1;
            }

            newList.push(item);
        }
        else {
            for (let index = 0; index < newList.length; index++) {
                const item = newList[index];
                if (item.contractid === row.contractid) {
                    item.totalAmount += amount_received;
                    if (amount_received < amount_receivable && item.isOwe === 0) {
                        item.isOwe = 1;
                        item.isWarn = 1;
                    }

                    if (invoice_amount < amount_receivable && item.needInvoice === 0) {
                        item.needInvoice = 1;
                        item.isWarn = 1;
                    }
                }
            }
        }


    })

    

    if (isOwe === 1) {
        newList = newList.filter(list => list.isOwe === 1);
    }
    else if (isOwe === 0) {
        newList = newList.filter(list => list.isOwe === 0);
    }

    if (needInvoice === 1) {
        newList = newList.filter(list => list.needInvoice === 1);
    }
    else if (needInvoice === 0) {
        newList = newList.filter(list => list.needInvoice === 0);
    }

    console.log('newList = ' + JSON.stringify(newList));

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

//加载列表数据，推送到reducer
export const onLoadTargetListByREQ = async (dispatch, payload) => {

   // console.log('payload = ' + JSON.stringify(payload));

    let { year, month, amount_received, invoice_amount, page, limit, contractid,isInit } = payload;

    // console.log(' contractid = ' + contractid);

    // console.log(' payload = ' + payload);

    let _isInit = isInit;

    const res = await getList(sourceUrl, page, limit, { contractid, year, month, amount_received, invoice_amount });



    let rows = res.rows;
    //let warnDetails = '';
    NoticeStart(rows,_isInit);

    dispatch({
        type: 'GET_TARGETLIST',
        payload: { ...res, page, limit, contractid }
    })


}

//加载列表数据，推送到reducer
export const onLoadTargetRentList = async (dispatch, payload) => {

    console.log('payload = ' + JSON.stringify(payload));

    let { page, limit, contractid,isInit } = payload;

    let _isInit = isInit;

    const res = await getList(sourceUrl, page, limit, { contractid });



    let rows = res.rows;
    //let warnDetails = '';
    NoticeStart(rows,_isInit);

    dispatch({
        type: 'GET_TARGETLIST',
        payload: { ...res, page, limit, contractid }
    })


}


//加载列表数据，推送到reducer
export const onLoadCollectionData = async (dispatch, payload) => {

    console.log('payload = ' + JSON.stringify(payload));

    let { page, limit } = payload;

    const res = await getList(sourceUrl, page, limit, {});

    //console.log('res === ' + JSON.stringify(res));



    let rows = res.rows;
    //let warnDetails = '';
    let warnArray = [];
    var contractSum = [0];
    var notices = [];
    rows.forEach((row, index, rows) => {
        //console.log(' value: ' + JSON.stringify(value) );
        //console.log(' index: ' + JSON.stringify(index));
        //console.log(' row: ' + JSON.stringify(row));
        row['contractno'] = row.zycontract.contractno;
        row['isWarn'] = 0;
        //如果已收金额小于应收金额，则提醒
        //console.log(' 差额：' + (row.amount_received < row.amount_receivable)); 
        let date = new Date();
        let currentYear = date.getFullYear();

        let currentMonth = date.getMonth() + 1;

        console.log('当前月份为' + currentMonth + '当前年份为' + currentYear);

        let yearInt = parseInt(row.year);

        let monthInt = parseInt(row.month);

        if (row.amount_received - row.amount_receivable < 0 && row.contract_status === 1) {
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

        if (row.isWarn === 1) {
            var noticecontent = '合同编号为' + row.contractno + '的' + row.year + '年' + row.month +
                '月份的租金未收齐，请留意!';

            var key = row.contractid;

            var notice = {};
            notice.id = key;
            notice.content = noticecontent;

            notices.push(notice);

            var info = row.year + '年' + row.month + '月份的租金目前只收到' + row.amount_received +
                '，仍拖欠' + (row.amount_receivable - row.amount_received) + '元<br/>';


            if (!contractSum.includes(row.contractid)) {
                contractSum.push(row.contractid);
                let temp = {};
                temp.title = '合同编号为' + row.contractno + '的收款情况如下:';
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
                openNotification('租金拖欠', notice.content, warn.title, warn.detail, 'warning', time);
                time = time + 0.3;
                return;
            }
        })

    })

    dispatch({
        type: 'GET_ALL',
        payload: { ...res, page, limit }
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
        console.log(
            '提醒欠款栏关闭.',
        );
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



export const onEditDetail = async (dispatch, payload) => {
    let { record } = payload;

    let id = record.id;

    dispatch({
        type: 'GET_ONEDETAIL',

        payload: { record, id }
    })
}

/**
 * 提交修改账单
 * @param {*} dispatch 
 * @param {*} payload record,page,limit
 */
export const onCommitEdit = async (dispatch, payload) => {

    let { record } = payload;

    await modifyOne(sourceUrl, record).then(async function (result) {

        if (result.code === 0) {
            message.info(result.msg);
        }
        else {
            message.warn('修改提交失败');
        }


    })
}




