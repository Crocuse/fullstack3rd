import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { SERVER_URL } from "../../config/server_url";
import { setLoginedId } from "../../redux/action/setLoginedId";
import LoadingModal from "../include/LoadingModal";

function NaverLogin() {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchData = async () => {
            const urlParams = new URLSearchParams(location.search);
            const code = urlParams.get('code');
    
            try {
                const response = await axios.post(`${SERVER_URL.SERVER_URL()}/auth/naver/callback`, { code });

                const { success, sessionID, loginedId } = response.data;
    
                if (success) {
                    dispatch(setLoginedId(sessionID, '', loginedId));
                    navigate('/');  
                } else {
                    navigate('/member/Login_form');
                }
            } catch (error) {
                console.error('네이버 로그인 콜백 처리 중 오류 발생:', error);
                navigate('/member/Login_form');
            }
        };
    
        fetchData();
    }, [dispatch, location, navigate]);

    return (
        <LoadingModal />
    )
}

export default NaverLogin;