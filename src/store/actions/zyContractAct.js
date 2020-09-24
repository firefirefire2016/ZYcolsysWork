import { getList, createTarget, modifyOne, updateOneStatus, updateALLStatus } from '../../services/zyService'
import store from '../store';
import { message } from 'antd';
//import { sourceUrl } from '../../utils/request';

//const zyContractData = store.getState().zyContractData;

const sourceUrl = 'zyContract';


//加载列表数据，推送到reducer
export const onLoadContractData = async (dispatch, payload) => {

    let { page, limit, req } = payload;

    console.log(payload);


    const res = await getList(sourceUrl, page, limit, req);

    let list = res.rows;

    let newSelects = [];

    console.log(newSelects);

    console.log(res);

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
        type: 'GET_ALL',
        payload: { ...res, page, limit, newSelects, res,rows: list }
    })
    //setSelects(newSelects);

}

export const onBackHome = async (dispatch, payload) => {

    dispatch({
        type: 'BACK_HOME',
        payload: { mode: 'home' }
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
        console.log(JSON.stringify(rentlist));
        dispatch({
            type: 'GET_ONE',
            payload: { record, id, mode: 'editing', rentlist }
        })
    });




}

export const onCreateData = async (dispatch, isCreating) => {
    //let {record} = payload;

    console.log(isCreating);

    dispatch({
        type: 'CREATE_ONE',
        payload: { mode: 'editing' }
    })

}

/**
 * 提交变化
 * @param {*} dispatch 
 * @param {*} payload record,page,limit
 */
export const onCommitStatus = async (dispatch, payload) => {

    let { record, edittype } = payload;

    console.log(JSON.stringify(record));

    await modifyOne(sourceUrl, record).then(async function (res) {

        if (res.code === 0) {
            message.info(res.msg);
        }
        else {
            message.warn('失败:' + res.msg);
        }

        switch (edittype) {
            case 'COMMIT_START':
                dispatch({
                    type: edittype,

                    payload: { res }

                })
                break;
            case 'COMMIT_REFUND':
                dispatch({
                    type: edittype,

                    payload: { res }

                })
                break;
            case 'COMMIT_STOP':
                dispatch({
                    type: edittype,

                    payload: { res }

                })
                break;
            case 'COMMIT_DEL':
                dispatch({
                    type: edittype,

                    payload: { res }

                })
                break;
            default:
                break;
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

        dispatch({
            type: "COMMIT_Edit",
            payload: { ...result, record, result }
        })

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

        let tagetdata = record;

        tagetdata.status = -1;

        await updateALLStatus(_sourceUrl, tagetdata).then(function (res) {
            if (res.code === 1) {
                //后台问题打印
                message.warn(res.msg);
            }
            else {

                console.log('修改状态成功');
            }
        })

        console.log(JSON.stringify(newtable));

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

        await updateALLStatus('zyCollection', tagetdata).then(function (res) {
            if (res.code === 1) {
                //后台问题打印
                message.warn(res.msg);
            }
            else {

                console.log('修改收款表状态成功');
            }
        }


        )

        // let includetargets = [];

        // let delids = [];

        // let createtargets = [];

        // let isInclude = false;

        // for (let index = 0; index < oldtable.length; index++) {
        //     const element = oldtable[index];
        //     isInclude = false;
        //     for (let i = 0; i < newtable.length; i++) {
        //         const ele = newtable[i];
        //         if(ele.id === element.id){
        //             includetargets.push(ele);
        //             isInclude = true;
        //             break;
        //         }
        //     }
        //     if(isInclude === false){
        //         delids.push(element.id);
        //     }
        // }

        // let needCreate = true;

        // for (let index = 0; index < newtable.length; index++) {
        //     const element = newtable[index];
        //     needCreate = true;
        //     for (let i = 0; i < includetargets.length; i++) {
        //         const ele = includetargets[i];
        //         if(ele.id === element.id){
        //             needCreate = false;
        //         }                
        //     }
        //     if(needCreate === true){
        //         createtargets.push(element);
        //     }
        // }

        // for (let index = 0; index < includetargets.length; index++) {
        //     let element = includetargets[index];
        //     await modifyOne(_sourceUrl, element).then(function(res3){
        //         if (res3.code === 0) {
        //             message.info(res3.msg);
        //         }
        //         else {
        //             message.warn('修改失败:' + res3.msg);
        //         }
        //     });            
        // }  

        // for (let index = 0; index < createtargets.length; index++) {
        //     let element = createtargets[index];
        //     element.contractid = contractid;
        //     await createTarget(_sourceUrl, element).then(function(res4){
        //         if (res4.code === 0) {
        //             message.info(res4.msg);
        //         }
        //         else {
        //             message.warn('创建失败:' + res4.msg);
        //         }
        //     });            
        // }   



    })
}

/**
 * 提交创建合同
 * @param {*} dispatch 
 * @param {*} payload record,page,limit
 */
export const onCommitCreate = async (dispatch, payload) => {

    let { record, page, limit, tabledata } = payload;

    let reData;

    let contractid;

    let rightid = record.rightid;

    //先创建合同
    await createTarget(sourceUrl, record).then(async function (res) {

        reData = res.data;

        contractid = reData.id;

        dispatch({
            type: "COMMIT_CREATE",
            payload: { ...res, record, res }
        })
        if (res.code === 0) {
            message.info(res.msg);
        }
        else {
            message.warn('创建失败:' + res.msg);
        }
    }

    ).then(async function (res) {

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

    })



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


