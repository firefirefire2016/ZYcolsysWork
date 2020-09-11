
const defaultState = {
    list: [],
    page: 1,
    limit: -1,
    total: 0
}

export default (state = defaultState, action) => {
    switch (action.type) {
        case 'GET_ALL':
            console.log(action);
            return {
                ...state,
                list: action.payload.rows,
                page: action.payload.page,
                total: action.payload.total,
                limit: action.payload.limit
            };
        case 'GET_TARGETLIST':
                console.log(action);
                return {
                    ...state,
                    list: action.payload.rows,
                    page: action.payload.page,
                    total: action.payload.total,
                    limit: action.payload.limit,
                    contractid:action.payload.contractid
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
                contractid:action.payload.contractid,
                limit:10
            };
        case 'CREATE_ON':
            return {
                ...state,
                isCreating: true,
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
                res: action.payload.result
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
                res: action.payload.result
            };
        default:
            return state;
    }
};