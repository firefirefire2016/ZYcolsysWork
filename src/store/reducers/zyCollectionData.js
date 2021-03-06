
const defaultState = {
    list: [],
    page: 1,
    limit: 10,
    total: 0
}

export default (state = defaultState, action) => {
    switch (action.type) {
        case 'COMMIT_DELRENT'://删除
            console.log(state);
            return {
                ...state,
                res: action.payload.res,
                mode: 'deled'
            };
        case 'SELECT_DETAIL':
            console.log(action);
            return{
                ...state,
                contractno:action.payload.contractno,
                isOwe:action.payload.isOwe,
                needInvoice:action.payload.needInvoice,
                mode:'detailselect',
            };
        case 'BACK_HOME':
            return {
                ...state,
                mode: action.payload.mode,
            };
        case 'KEEP_RENTDATA':
            console.log(action.type);
            return {
                ...state,
                mode: action.payload.mode,
                record: action.payload.record,
            }
        case 'MERGE_REQ':
            return {
                ...state,
                list: action.payload.rows,
                page: action.payload.page,
                total: action.payload.total,
                limit: action.payload.limit
            }
        // case 'GET_ALL':
        //     //console.log(action);
        //     return {
        //         ...state,
        //         list: action.payload.rows,
        //         page: action.payload.page,
        //         total: action.payload.total,
        //         limit: action.payload.limit,
        //         res: null
        //     };
        case 'LOADING':
            return {
                isLoading:true
            };
        // case 'MODAL_TARGETLIST':
        //     return{
        //         ...state,
        //         targetRentlist:action.payload.newList,
        //     }
        case 'GET_TARGETLIST':
            console.log(action);
            return {
                ...state,
                list: action.payload.newList,
                page: action.payload.page,
                total: action.payload.total,
                limit: action.payload.limit,
                isLoading: false,
               // mode:'home',
                res: null
            };

        case 'MERGE_ALL':
            console.log(action);
            return {
                ...state,
                list: action.payload.newList,
                page: action.payload.page,
                total: action.payload.newList.length,
                limit: action.payload.limit,
                isLoading: false,
            };
        case 'EDIT_ON':
            console.log(action);
            return {
                ...state,
                record: action.payload.record,
                contractid: action.payload.contractid,
                limit: 10
            };
        case 'COMMIT_CREATE':
            console.log(action);
            return {
                ...state,
                mode:'home',
                res: action.payload.res
            };
        case 'CREATE_ONE':
            return {
               // ...state,
                mode: 'creating',
            };
        case 'GET_ONEDETAIL':
            console.log(action);
            return {
                ...state,
                record: action.payload.record,
                id: action.payload.id,
                mode: action.payload.mode,
            };
        case 'COMMIT_Edit':
            console.log(action);
            return {
                ...state,
                mode:'home',
                res: action.payload.res
            };
        case 'COMMIT_GetRent':
            console.log(state);
            return {
                ...state,
                rentRes: action.payload.res
            };
        case 'COMMIT_GetInvoice':
            console.log(state);
            return {
                ...state,
                invoiceRes: action.payload.res
            };
        default:
            return state;
    }
};