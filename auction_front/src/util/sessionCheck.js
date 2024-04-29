export const sessionCheck = (sessionId, navigate) => {
    if (sessionId === '') {
        navigate('/member/login_form');
    }
}