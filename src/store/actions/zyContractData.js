import {getList,createTarget,modifyOne,delOne } from '../../services/zyService'

export const loadContractData = payload => async dispatch =>{

    const res = await getList();

    dispatch({
        type:'GET_ALL',
        payload:res
    })

}