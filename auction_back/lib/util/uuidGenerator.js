const generateTemp = (length) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let tempPassword = '';

    for (let i = 0; i < length; i++) {
        tempPassword += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    return tempPassword;
};

module.exports = generateTemp;
