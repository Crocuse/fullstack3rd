const inital_state = {
    loginedId: {
        loginedAdmin: '',
        loginedId: '',
    }
}

export const loginedInfoReducer = (state = inital_state, action) => {

    switch(action.type) {
        case 'SET_LOGINED_ID':
            state['loginedId']['loginedAdmin'] = action.loginedAdmin;
            state['loginedId']['loginedId'] = action.loginedId;
            return {...state};
        
        default:
            return state;
    }

}