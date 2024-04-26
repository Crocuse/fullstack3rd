export const setLoginedId = (loginedAdmin, loginedId) => {
    return {
        type: 'SET_LOGINED_ID',
        loginedAdmin: loginedAdmin,
        loginedId: loginedId
    }
}