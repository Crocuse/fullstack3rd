export const setLoginedId = (sessionId, loginedAdmin, loginedId) => {
    return {
        type: 'SET_LOGINED_ID',
        sessionId: sessionId,
        loginedAdmin: loginedAdmin,
        loginedId: loginedId
    }
}