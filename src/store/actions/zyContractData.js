import { getList, createTarget, modifyOne, delOne } from '../../services/zyService'
import store from '../store';
import { message } from 'antd';
//import { sourceUrl } from '../../utils/request';

//const zyContractData = store.getState().zyContractData;

const sourceUrl = 'zyContract';


//加载列表数据，推送到reducer
export const onLoadContractData = async (dispatch, payload) => {

    console.log('payload = ' + JSON.stringify(payload));

    let { page, limit, contractno, renttype, startdate, enddate } = payload;


    console.log(startdate);

    console.log(enddate);

    const res = await getList(sourceUrl,page, limit, { contractno, renttype, startdate, enddate });

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

/**
 * 提交创建合同
 * @param {*} dispatch 
 * @param {*} payload record,page,limit
 */
export const onCommitCreate = async (dispatch, payload) => {

    let { record, page, limit } = payload;

    let reData;

    await createTarget(sourceUrl,record).then(async function (result) {



        await getList(sourceUrl,page, limit).then(function (res) {
            dispatch({
                type: "COMMIT_CREATE",
                payload: { ...res, record, result }
            })
            console.log(res);
            if (result.code === 0) {
                message.info(result.msg);
                reData = res.data;
            }
            else {
                message.warn('创建合同失败');
            }
        }

        ).then(async function (res) {
            //创建1到12月的收款

            //let tempYear =  values.startdate;

            let tempsYear = parseInt(record.startdate.toString().substring(0, 4));

            let tempsMonth = parseInt(record.startdate.toString().substring(5, 7));

            let tempeYear = parseInt(record.enddate.toString().substring(0, 4));

            let tempeMonth = parseInt(record.enddate.toString().substring(5, 7));

            console.log('初始到结束的年月：' + tempsYear + tempsMonth + tempeYear + tempeMonth);

            //结束的年月改成当前年月
            let date = new Date();
            let currentYear = date.getFullYear();
            let currentMonth = date.getMonth();

            console.log('当前年=' + currentYear + '当前月=' + currentMonth);

            // console.log(reData.id);
            //创建收款表
            createColletions(tempsYear, currentYear, tempsMonth, currentMonth + 1, reData);


        }

        )



    })



}

//创建收款表的实现
const createColletions = async (tempsYear, tempeYear, tempsMonth, tempeMonth, reData) => {

    const _sourceUrl = 'zyCollection';

    let resetyear = false;

    let endmonth = 12;

    for (let year = tempsYear; year < tempeYear + 1; year++) {
        if (year === tempeYear) {
            endmonth = tempeMonth;
        }
        if (resetyear === true) {
            tempsMonth = 1;

            resetyear = false;
        }

        for (let month = tempsMonth; month < endmonth + 1; month++) {

            let newCollection = {
                contractid: reData.id,
                status: 1,
                year: year,
                month: month,
                amount_receivable: reData.month_rent
            }
            // eslint-disable-next-line no-loop-func
            await createTarget(_sourceUrl,newCollection).then(function (res) {
                if (res.code === 1) {
                    message.warn(res.msg);
                    return;
                }
                else {
                    if (month === 12) {
                        resetyear = true;
                    }
                }


            })



        }
        message.success('创建对应收款表成功！');

    }
}


    //初始化列表数据，同时获取提醒数据
    export const onInit = async (dispatch, payload) => {

    }

