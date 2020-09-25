
const defaultState = {
    list: [],
    page: 1,
    limit: 10,
    total: 0
}

export default (state = defaultState, action) => {
    switch (action.type) {
        case 'KEEP_DATA':
            return{
                ...state,
                record:action.payload.record,
                _tabledata:action.payload._tabledata,
            }
        case 'GET_ALL':
            console.log(action);
            return {
                ...state,
                list: action.payload.rows,
                page: action.payload.page,
                total: action.payload.total,
                limit: action.payload.limit,
                newSelects: action.payload.newSelects,
                res: null,
            };
        case 'GET_ONE':
            console.log(action);
            return {
                ...state,
                record: action.payload.record,
                mode: action.payload.mode,
                isCreating: false,
                rentlist: action.payload.rentlist,
            };
        case 'CREATE_ONE':
            return {
                ...state,
                mode: action.payload.mode,
                isCreating: true,
            };
        case 'BACK_HOME':
            return {
                ...state,
                mode: action.payload.mode,
                isCreating: false,
            };
        case 'COMMIT_CREATE':
            console.log(action);
            return {
                ...state,
                record: action.payload.record,
                list: action.payload.rows,
                page: action.payload.page,
                total: action.payload.total,
                limit: action.payload.limit,
                res: action.payload.res
            };
        case 'COMMIT_Edit':
            console.log(action);
            return {
                ...state,
                record: action.payload.record,
                list: action.payload.rows,
                page: action.payload.page,
                total: action.payload.total,
                limit: action.payload.limit,
                //res: action.payload.result
                mode:'home',
            };
        case 'COMMIT_START'://启用
            console.log(state);
            return {
                ...state,
                res: action.payload.res,
                mode:'started'
            };
        case 'COMMIT_REFUND'://退租
            console.log(state);
            return {
                ...state,
                res: action.payload.res,
                mode:'refunded'
            };
        case 'COMMIT_STOP'://停用
            console.log(state);
            return {
                ...state,
                res: action.payload.res,
                mode:'stoped'
            };
        case 'COMMIT_DEL'://删除
            console.log(state);
            return {
                ...state,
                res: action.payload.res,
                mode:'deled'
            };
        default:
            return state;
    }
};