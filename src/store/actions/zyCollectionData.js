import React  from 'react'
import { getList, createTarget, modifyOne, delOne } from '../../services/zyService'
import store from '../store';
import { message, Button,notification } from 'antd';
import Modal from 'antd/lib/modal/Modal';
//import { sourceUrl } from '../../utils/request';

//const zyContractData = store.getState().zyContractData;

const sourceUrl = 'zyCollection';

export const RentToMergeData = async (dispatch,payload)=>{

    //console.log('payload = ' + JSON.stringify(payload));

    let { page,limit} = payload;

    //let limit = {};

    let req = {};

    const res = await getList(sourceUrl, page, limit, req);

    let newList = [];

    //加载数据需要合并分析
    let rows = res.rows;
    //遍历每月账单，合并一起

    let contracts = [];

    console.log(' res.rows = ' + rows)

    rows.forEach((row, index, rows) => {
        if(!contracts.includes(row.contractid)){
            console.log(' id = ' + row.contractid)
            contracts.push(row.contractid);
            let item = {
                contractid:row.contractid,
                contractno:row.zycontract.contractno,
                tenant:row.zycontract.tenant,
                rentdate:row.zycontract.rentdate,
                totalAmount:row.amount_received,
                current_received:row.amount_received,
                current_invoice:row.current_invoice,
                month_rent:row.zycontract.month_rent
            }
            newList.push(item);
        }
        else{
            for (const item in newList) {
                if(item.contractid === row.contractid){
                    item.totalAmount += row.amount_received;
                    break
                }
            }
        }
        

    })

     //console.log('contracts = ' + JSON.stringify(contracts) );

     console.log('newList = ' + newList);

    dispatch({
        type: 'MERGE_ALL',
        payload: {...res, page, limit,newList }
    })


}

export const onLoadTargetRent = async(dispatch,payload) =>{
    let { record } = payload;

    let contractid = record.contractid;

    dispatch({
        type: 'EDIT_ON',
        payload: { record,contractid }
    })
}

//加载列表数据，推送到reducer
export const onLoadTargetRentList = async (dispatch, payload) => {

    console.log('payload = ' + JSON.stringify(payload));

    let { page, limit,contractid } = payload;

    console.log(' contractid = ' + contractid);

    console.log(' payload = ' + payload);

    const res = await getList(sourceUrl, page, limit, {contractid});

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

        if (row.amount_received - row.amount_receivable < 0 && row.status === 1) {
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

        if (row.isWarn === 1 ) {
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
        type: 'GET_TARGETLIST',
        payload: { ...res, page, limit,contractid }
    })


}


//加载列表数据，推送到reducer
export const onLoadCollectionData = async (dispatch, payload) => {

    console.log('payload = ' + JSON.stringify(payload));

    let { page, limit  } = payload;

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

        if (row.amount_received - row.amount_receivable < 0 && row.status === 1) {
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

        if (row.isWarn === 1 ) {
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

function detailInfo(title,content) {
    Modal.info({
      title,
      content:(<div dangerouslySetInnerHTML={{ __html: content }}/>),
      onOk() {},
      okText:'好的'
    });
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

    await modifyOne(sourceUrl, record).then(async function (result) {

        await getList(sourceUrl, page, limit).then(function (res) {
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




