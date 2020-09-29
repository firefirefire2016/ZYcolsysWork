
const defaultState = {
    list: [],
    page: 1,
    limit: 10,
    total: 0
}

export default (state = defaultState, action) => {
    switch (action.type) {
        case 'MERGE_REQ':
            return {
                ...state,
                list: action.payload.rows,
                page: action.payload.page,
                total: action.payload.total,
                limit: action.payload.limit
            }
        case 'GET_ALL':
            //console.log(action);
            return {
                ...state,
                list: action.payload.rows,
                page: action.payload.page,
                total: action.payload.total,
                limit: action.payload.limit,
                res: null
            };
        case 'GET_TARGETLIST':
            console.log(action);
            return {
                ...state,
                list: action.payload.newList,
                page: action.payload.page,
                total: action.payload.total,
                limit: action.payload.limit,
                isLoading: false,
                res: null
            };

        case 'MERGE_ALL':
            console.log(action);
            return {
                ...state,
                list: action.payload.newList,
                page: action.payload.page,
                total: action.payload.newList.length,
                limit: action.payload.limit
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
                res: action.payload.res
            };
        case 'CREATE_ONE':
            return {
                ...state,
                mode:'creating',
            };
        case 'GET_ONEDETAIL':
            console.log(action);
            return {
                ...state,
                record: action.payload.record,
                id: action.payload.id,
                isCreating: false,
                mode: action.payload.mode,
            };
        case 'COMMIT_Edit':
            console.log(action);
            return {
                ...state,
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