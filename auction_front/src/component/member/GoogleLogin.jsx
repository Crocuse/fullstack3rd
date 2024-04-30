import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { SERVER_URL } from "../../config/server_url";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setLoginedId } from "../../redux/action/setLoginedId";

function GoogleLogin() {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const code = queryParams.get('code');
        if (code) {
            sendCodeToBackend(code);
        }
    }, [location]);

    async function sendCodeToBackend(code) {
        try {
            const response = await axios.post(`${SERVER_URL.SERVER_URL()}/auth/google/callback`, {
                code: code
            });
            if (response.data.success) {
                
                dispatch(setLoginedId(response.data.sessionID, '', response.data.loginedId));
                navigate('/');
            } else {
                // 로그인 실패 시 에러 메시지 표시
                alert(response.data.message);
                navigate('/member/Login_form');
            }
        } catch (error) {
            console.error('백엔드로 코드 전송 오류:', error);
            navigate('/member/Login_form');
        }
    }

    return (
        <div>
            <p>Google Login 처리 중...</p>
        </div>
    )
}

export default GoogleLogin;