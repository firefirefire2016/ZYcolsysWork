import {getList,createTarget,modifyOne,delOne } from '../../services/zyService'

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