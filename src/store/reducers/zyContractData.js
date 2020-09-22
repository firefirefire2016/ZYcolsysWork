
const defaultState = {
    list: [],
    page: 1,
    limit: 10,
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
                limit: action.payload.limit,
                newSelects:action.payload.newSelects,
            };
        case 'GET_ONE':
            console.log(action);
            return {
                ...state,
                record: action.payload.record,
                mode: action.payload.mode,
                isCreating: false,
            };
        case 'CREATE_ONE':
            return {
                ...state,
                mode: action.payload.mode,
                isCreating: true,
            };
        case 'COMMIT_CREATE':
            console.log(action);
            return {
                ...state,
                record:action.payload.record,
                list: action.payload.rows,
                page: action.payload.page,
                total: action.payload.total,
                limit: action.payload.limit,
                res:action.payload.result
            };
        case 'COMMIT_Edit':
            console.log(action);
            return {
                ...state,
                record:action.payload.record,
                list: action.payload.rows,
                page: action.payload.page,
                total: action.payload.total,
                limit: action.payload.limit,
                res:action.payload.result
            };
        default:
            return state;
    }
};