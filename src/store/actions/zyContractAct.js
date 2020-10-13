import { getList, createTarget, modifyOne, updateOneStatus, updateALLStatus, startContract } from '../../services/zyService'
import store from '../store';
import { message } from 'antd';
//import { getTodayStr, timeToStr } from '../../utils/common'
//import { sourceUrl } from '../../utils/request';

//const zyContractData = store.getState().zyContractData;

const sourceUrl = 'zyContract';

export const onSelectToRent = async (dispatch, payload) => {

    let { record } = payload;

    dispatch({
        type: 'TO_Rent',
        payload: { selectdata: record }
    })


}

export const getContractList = async (dispatch, payload) => {

    let { page, limit, req } = payload;
    const res = await getList(sourceUrl, page, limit, req);

    let list = res.rows;

    let newSelects = [];


    if (list) {
        for (let index = 0; index < list.length; index++) {
            const element = list[index];
            newSelects.push(element.contractno);
        }
    }

    list.forEach(row => {
        row['area'] = row.zypropertyrights[0].area;
        row['insidearea'] = row.zypropertyrights[0].insidearea;
        row['simpleaddress'] = row.zypropertyrights[0].simpleaddress;
    });


    dispatch({
        type: 'GET_LIST',
        payload: { ...res, page, limit, newSelects, res, rows: list }
    })
}

//加载列表数据，推送到reducer
export const onLoadContractData = async (dispatch, payload) => {



    // dispatch({
    //     type: 'LOADING',
    //   //  payload: { mode }
    // })    

    let { page, limit, req } = payload;
    const res = await getList(sourceUrl, page, limit, req);

    let list = res.rows;

    let newSelects = [];


    if (list) {
        for (let index = 0; index < list.length; index++) {
            const element = list[index];
            newSelects.push(element.contractno);
        }
    }

    list.forEach(row => {
        row['area'] = row.zypropertyright.area;
        row['insidearea'] = row.zypropertyright.insidearea;
        row['simpleaddress'] = row.zypropertyright.simpleaddress;
        if (row.contract_status === 2 || row.contract_status === 3) {
            row.isWarn = true;
        }
    });

    console.log(list);

    dispatch({
        type: 'GET_ALL',
        payload: { ...res, page, limit, newSelects, res, rows: list }
    })


}

export const onBackHome = async (dispatch, payload) => {

    dispatch({
        type: 'BACK_HOME',
        payload: { mode: 'home' }
    })

}

export const getRightno = async(dispatch,payload) =>{
    let { record } = payload;

   // console.log(mode);

    // dispatch({
    //     type: 'KEEP_DATA',
    //    // payload: { rightno  }
    // })
}

export const keepFormdata = async (dispatch, payload) => {

    let { formdata, tabledata, mode,rightno } = payload;

    console.log(mode);

    dispatch({
        type: 'KEEP_DATA',
        payload: { record: formdata, _tabledata: tabledata, mode }
    })

    dispatch({
        type: 'TO_PROPERTY',
        payload: { rightno }
    })
}

export const onShowDetail = async (dispatch, payload) => {

    let { record } = payload;

    let id = record.id;

    const _sourceUrl = 'zyRentlist';

    let rentlist;

    await getList(_sourceUrl, 1, -1, { contractid: id }).then(function (res) {
        if (res.code === 1) {
            //后台问题打印
            message.warn(res.msg);
        }
        else {
            rentlist = res.rows;
        }
        console.log(JSON.stringify(rentlist));
        dispatch({
            type: 'GET_ONE',
            payload: { record, id, mode: 'details', rentlist }
        })
    });
}


export const onContinueContract = async (dispatch, payload) => {

    let { record } = payload;

    let id = record.id;

    const _sourceUrl = 'zyRentlist';

    let rentlist;

    await getList(_sourceUrl, 1, -1, { contractid: id }).then(function (res) {
        if (res.code === 1) {
            //后台问题打印
            message.warn(res.msg);
        }
        else {
            rentlist = res.rows;
        }
        console.log(JSON.stringify(rentlist));
        dispatch({
            type: 'GET_ONE',
            payload: { record, id, mode: 'keepon', rentlist }
        })
    });




}

export const onGetEditData = async (dispatch, payload) => {

    let { record } = payload;

    let id = record.id;

    const _sourceUrl = 'zyRentlist';

    let rentlist;

    await getList(_sourceUrl, 1, -1, { contractid: id }).then(function (res) {
        if (res.code === 1) {
            //后台问题打印
            message.warn(res.msg);
        }
        else {
            rentlist = res.rows;
        }
       // console.log(JSON.stringify(rentlist));
        dispatch({
            type: 'GET_ONE',
            payload: { record, id, mode: 'editing', rentlist }
        })
    });




}

export const onCreateData = async (dispatch, isCreating) => {
    //let {record} = payload;

    // console.log(isCreating);

    dispatch({
        type: 'CREATE_ONE',
        payload: { mode: 'creating' }
    })

    dispatch({
        type: 'selectmode_NULL',
        // payload: { selectmode: 'creating' }
    })

}

/**
 * 提交变化
 * @param {*} dispatch 
 * @param {*} payload record,page,limit
 */
export const onCommitStatus = async (dispatch, payload) => {

    let { record, _record, edittype } = payload;



    await modifyOne(sourceUrl, _record).then(async function (res) {

        if (res.code === 0) {
            message.info(res.msg);

            switch (edittype) {
                case 'COMMIT_REFUND':
                    record.stopdate = _record.stopdate;
                    record.stopreason = _record.stopreason;
                    record.contract_status = _record.contract_status;
                    record.quitdate = _record.quitdate;
                    dispatch({
                        type: edittype,

                        payload: { res }

                    })
                    break;
                case 'COMMIT_STOP':
                    record.stopdate = _record.stopdate;
                    record.stopreason = _record.stopreason;
                    record.contract_status = _record.contract_status;
                    dispatch({
                        type: edittype,

                        payload: { res }

                    })
                    break;
                case 'COMMIT_DEL':
                    record.contract_status = _record.contract_status;
                    dispatch({
                        type: edittype,

                        payload: { res }

                    })
                    break;
                default:
                    break;
            }
        }
        else {
            message.warn('失败:' + res.msg);
        }




    })
}

/**
 * 提交更改合同
 * @param {*} dispatch 
 * @param {*} payload record,page,limit
 */
export const onCommitEdit = async (dispatch, payload) => {

    let { record, page, limit, newtable } = payload;

    let rightid = record.rightid;

    let contractid = record.id;

    


    await modifyOne(sourceUrl, record).then(async function (result) {

        if (result.code === 0) {

            message.info(result.msg);

        }
        else {
            message.warn('修改提交失败');
        }



        let targetdata = { id: rightid, contractid };

        //更新对应产权
        await modifyOne('zyProperty', targetdata).then(function (res2) {
            if (res2.code === 0) {
                message.info(res2.msg);
                dispatch({
                    type: "COMMIT_Edit",
                    payload: { ...result, record, result }
                })
            }
            else {
                message.warn('绑定产权失败:' + res2.msg);
            }
        })

        //创建收款标准
        const _sourceUrl = 'zyRentlist';

        let tagetdata = record;

        tagetdata.status = -1;

        await updateALLStatus(_sourceUrl, tagetdata).then(function (res) {
            if (res.code === 1) {
                //后台问题打印
                message.warn(res.msg);
            }
            else {

                console.log('修改租金标准成功');
            }
        })


        for (let index = 0; index < newtable.length; index++) {
            let element = newtable[index];

            element.contractid = contractid;

            await createTarget(_sourceUrl, element).then(function (res) {
                if (res.code === 0) {
                    message.info(res.msg);
                }
                else {
                    message.warn('创建失败:' + res.msg);
                }
            });
        }

    })
}


/**
 * 提交创建合同
 * @param {*} dispatch 
 * @param {*} payload record,page,limit
 */
export const onCommitCreate = async (dispatch, payload) => {

    let { record, tabledata } = payload;

    let reData;

    let contractid;

    let rightid = record.rightid;

    //先创建合同
    await createTarget(sourceUrl, record).then(async function (res) {

        if (res.code === 0) {
            message.info(res.msg);
            dispatch({
                type: "COMMIT_CREATE",
                payload: { ...res, record, res }
            })
            reData = res.data;

            contractid = reData.id;
        }
        else {
            message.warn('创建失败:' + res.msg);
            //return;
        }
    }

    ).then(async function (res) {

        console.log(reData);
        console.log(contractid);
        console.log(record);
        if (reData  && contractid ) {
            let targetdata = { id: rightid, contractid };

            //更新对应产权
            await modifyOne('zyProperty', targetdata).then(function (res2) {
                if (res2.code === 0) {
                    message.info(res2.msg);
                }
                else {
                    message.warn('绑定产权失败:' + res2.msg);
                }
            })

            //创建收款标准
            const _sourceUrl = 'zyRentlist';

            for (let index = 0; index < tabledata.length; index++) {
                let element = tabledata[index];

                element.contractid = contractid;

                await createTarget(_sourceUrl, element).then(function (res3) {
                    if (res3.code === 0) {
                        message.info(res3.msg);
                    }
                    else {
                        message.warn('创建失败:' + res3.msg);
                    }
                });
            }
        }

    })



}


/**
 * 启用合同
 * @param {*} dispatch 
 * @param {*} payload 
 */
export const onStartEffect = async (dispatch, payload) => {
    //获取合同的id
    let { record } = payload;


    await startContract(sourceUrl, record).then(function (res) {
        if (res.code === 1) {
            //后台问题打印
            message.warn(res.msg);
        }
        else {
            record.contract_status = 1;
            record.once_rent = res.once_rent;
            console.log('启用合同成功');
            dispatch({
                type: "COMMIT_START",
                payload: { res }
            })
        }


    });


}


/**
 * 提交创建合同
 * @param {*} dispatch 
 * @param {*} payload record,page,limit
 */
export const onCommitCreate2 = async (dispatch, payload) => {

    let { record, page, limit, tabledata } = payload;

    let reData;

    await createTarget(sourceUrl, record).then(async function (result) {

        reData = result.data;

        await getList(sourceUrl, page, limit).then(function (res) {
            dispatch({
                type: "COMMIT_CREATE",
                payload: { ...res, record, result }
            })
            console.log(res);
            if (result.code === 0) {
                message.info(result.msg);

            }
            else {
                message.warn('创建合同失败');
            }
        }

        ).then(async function (res) {
            //创建1到12月的收款

            //创建收款标准

            //let tempYear =  values.startdate;

            let tempsYear = parseInt(record.startdate.toString().substring(0, 4));

            let tempsMonth = parseInt(record.startdate.toString().substring(4, 6));

            let tempeYear = parseInt(record.enddate.toString().substring(0, 4));

            let tempeMonth = parseInt(record.enddate.toString().substring(4, 6));

            console.log('初始到结束的年月：' + tempsYear + tempsMonth + tempeYear + tempeMonth);

            //结束的年月改成当前年月
            let date = new Date();
            let currentYear = date.getFullYear();
            let currentMonth = date.getMonth();

            console.log('当前年=' + currentYear + '当前月=' + currentMonth);

            //console.log('reData=' + JSON.stringify(reData) );
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

            console.log(_sourceUrl);

            console.log(newCollection);


            // eslint-disable-next-line no-loop-func
            await createTarget(_sourceUrl, newCollection).then(function (res) {
                if (res.code === 1) {
                    console.log(res);
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



export const onCommitUpdateStatus = async (dispatch, payload) => {

    let { id, status, page, limit } = payload;

    console.log(JSON.stringify(payload));

    await updateOneStatus(sourceUrl, payload).then(async function (result) {

        if (result.code === 1) {
            //后台问题打印
            message.warn(result.msg);
        }
        else {

            console.log('修改合同状态成功');
        }

        await updateALLStatus('zyCollection', payload).then(function (res) {
            if (res.code === 1) {
                //后台问题打印
                message.warn(res.msg);
            }
            else {

                console.log('修改收款表状态成功');
            }
        }


        ).then(async function (res) {

            await getList(sourceUrl, page, limit).then(function (res) {
                dispatch({
                    type: "GET_ALL",
                    payload: { ...res, page, limit }
                })
                console.log(res);
                if (res.code === 0) {
                    message.info(res.msg);
                }
                else {
                    message.warn('修改状态提交失败');
                }


            })


        }
        )

    })
}


