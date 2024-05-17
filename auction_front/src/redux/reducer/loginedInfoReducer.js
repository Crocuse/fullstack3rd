const inital_state = {
    loginedId: {
        sessionId: '',
        loginedAdmin: '',
        loginedId: '',
    }
}

export const loginedInfoReducer = (state = inital_state, action) => {

    switch(action.type) {
        case 'SET_LOGINED_ID':
            state['loginedId']['sessionId'] = action.sessionId;
            state['loginedId']['loginedAdmin'] = action.loginedAdmin;
            state['loginedId']['loginedId'] = action.loginedId;
            return {...state};
        
        default:
            return state;
    }

}