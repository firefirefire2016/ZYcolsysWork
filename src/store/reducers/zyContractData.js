
const defaultState = {
    list: [],
    page: 1,
    limit: 10,
    total: 0,
}

export default (state = defaultState, action) => {
    switch (action.type) {
        case 'TO_Rent':
            return {
                ...state,
                selectdata:action.payload.selectdata,
                selectmode:'backrent',
            }; 
        case 'TO_SELECT':
            return {
                selectmode:'toselect',
            };
        case 'LOADING':
            return {
                isLoading: true,
                //  mode:action.payload.mode,
            }
        case 'KEEP_DATA':
            console.log(action.type);
            return {
                ...state,
                mode: action.payload.mode,
                record: action.payload.record,
                _tabledata: action.payload._tabledata,
            }
        case 'GET_LIST':
            console.log(state);
            return {
                ...state,
                list: action.payload.rows,
                page: action.payload.page,
                total: action.payload.total,
                limit: action.payload.limit,
                //newSelects: action.payload.newSelects,
                contractlist: action.payload.rows,
                isLoading: false,
                res: null
            };
        case 'GET_ALL':
            console.log(state);
            return {
                ...state,
                list: action.payload.rows,
                page: action.payload.page,
                total: action.payload.total,
                limit: action.payload.limit,
                //newSelects: action.payload.newSelects,
                contractlist: action.payload.rows,
                isLoading: false,
                res: null,
            };
        case 'GET_ONE':
            console.log(action);
            return {
                ...state,
                record: action.payload.record,
                mode: action.payload.mode,
                rentlist: action.payload.rentlist,
            };
        case 'CREATE_ONE':
            return {
                ...state,
                rentlist:null,
                mode: 'creating',
            };
        case 'BACK_HOME':
            return {
                ...state,
                mode: action.payload.mode,
            };
        case 'COMMIT_CREATE':
            console.log(action);
            return {
                ...state,
                record: null,
                list: action.payload.rows,
                page: action.payload.page,
                total: action.payload.total,
                limit: action.payload.limit,
                res: action.payload.res,
                _tabledata: null,
                mode: 'home',
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
                mode: 'home',
            };
        case 'COMMIT_START'://启用
            console.log(state);
            return {
                ...state,
                res: action.payload.res,
                mode: 'started'
            };
        case 'COMMIT_REFUND'://退租
            console.log(state);
            return {
                ...state,
                res: action.payload.res,
                record: action.payload.record,
                mode: 'refunded'
            };
        case 'COMMIT_STOP'://停用
            console.log(state);
            return {
                ...state,
                res: action.payload.res,
                mode: 'stoped'
            };
        case 'COMMIT_DEL'://删除
            console.log(state);
            return {
                ...state,
                res: action.payload.res,
                mode: 'deled'
            };
        default:
            return state;
    }
};