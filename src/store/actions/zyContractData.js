import {getList,createTarget,modifyOne,delOne } from '../../services/zyService'
import store from '../store';

//const zyContractData = store.getState().zyContractData;

export const loadContractData = payload => async dispatch => {
    console.log(payload);
    //console.log(dispatch);
    let {page,limit} = payload;
    const res = await getList(page,limit);

    dispatch({
        type:'GET_ALL',
        payload:{...res,page,limit}
    })

}

//加载列表数据，推送到reducer
export const onLoadContractData = async (dispatch,payload) =>{

    let {page,limit} = payload;


    const res = await getList(page,limit);

    //console.log(dispatch);

    dispatch({
        type:'GET_ALL',
        payload:{...res,page,limit}
    })


}

export const onGetEditData = async(dispatch,payload) =>{
    let {record} = payload;

    dispatch({
        type:'GET_ONE',
        payload:{record}
    })

}

//当更换页面显示行数时，更改limit
export const onChangeSize = async(dispatch,targetSize)=>{

    const page = 1;

    const res = await getList(page,targetSize);

    dispatch({
        type:'SET_LIMIT',
        payload:{...res,page,limit:targetSize}
    })


}

//初始化列表数据，同时获取提醒数据
export const onInit = async(dispatch,payload)=>{

}

