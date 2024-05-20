export const SERVER_URL = {
    SERVER_URL: () => `${process.env.REACT_APP_API_URL + ':' + process.env.REACT_APP_PORT}`,
    SOCKET_URL: () => `${process.env.REACT_APP_API_URL}`,
};
