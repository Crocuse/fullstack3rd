import axios from 'axios';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { SERVER_URL } from '../../config/server_url';
import { setLoginedId } from '../../redux/action/setLoginedId';
import LoadingModal from '../include/LoadingModal';

function KakaoLogin() {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchData = async () => {
            const urlParams = new URLSearchParams(location.search);
            const code = urlParams.get('code');

            if (!code) {
                // 최초 접속 시 kakaoAuthURL을 요청합니다.
                try {
                    const response = await axios.get(`${SERVER_URL.SERVER_URL()}/auth/kakao`);
                    const { url: kakaoAuthURL } = response.data;

                    // 먼저 루트 경로로 리다이렉트합니다.
                    navigate('/');

                    // 그 후 kakaoAuthURL로 리다이렉트합니다.
                    window.location.href = kakaoAuthURL;
                } catch (error) {
                    console.error('카카오 로그인 URL 가져오기 실패:', error);
                    navigate('/member/Login_form');
                }
            } else {
                // 카카오 인증 후 콜백 처리
                try {
                    const response = await axios.post(`${SERVER_URL.SERVER_URL()}/auth/kakao/callback`, { code });
                    const { success, sessionID, loginedId } = response.data;
                    if (success) {
                        dispatch(setLoginedId(sessionID, '', loginedId));
                        navigate('/');
                    } else {
                        navigate('/member/Login_form');
                    }
                } catch (error) {
                    console.error('카카오 로그인 콜백 처리 중 오류 발생:', error);
                    navigate('/member/Login_form');
                }
            }
        };

        fetchData();
    }, [dispatch, location, navigate]);

    return <LoadingModal />;
}

export default KakaoLogin;
