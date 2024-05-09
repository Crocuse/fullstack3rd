import React, { useEffect } from 'react';
import '../../css/Customer_center/CenterNav.css';
import { Link, Outlet } from 'react-router-dom';

const CenterNav = () => {
    // Hook ----------------------------------------------------------------------------------------------------------------------------------
    useEffect(() => {
        // Kakao SDK 스크립트 로드
        const script = document.createElement('script');
        script.src = 'https://t1.kakaocdn.net/kakao_js_sdk/2.7.1/kakao.min.js';
        script.async = true;
        script.crossOrigin = 'anonymous';
        script.integrity = 'sha384-kDljxUXHaJ9xAb2AzRd59KxjrFjzHa5TAoFQ6GbYTCAG0bjM55XohjjDT7tDDC01';
        document.head.appendChild(script);

        // Kakao.init 함수 호출
        script.onload = () => {
            window.Kakao.init('b9ad816e0e7b482a41126f2189fe3b38');
        };

        // 컴포넌트 언마운트 시 스크립트 제거
        return () => {
            document.head.removeChild(script);
        };
    }, []);

    // Handler ----------------------------------------------------------------------------------------------------------------------------------
    const kakaoChanelAddClick = () => {
        window.Kakao.Channel.addChannel({
            channelPublicId: '_xnxhzkG',
        });
    };

    const kakaoChatClick = () => {
        window.Kakao.Channel.chat({
            channelPublicId: '_xnxhzkG',
        });
    };

    // View ----------------------------------------------------------------------------------------------------------------------------------
    return (
        <>
            <div class="customer_center_nav">
                <a href="#" class="button" onClick={kakaoChanelAddClick}>
                    <img src="/img/customer_center/kakaotalk_white.png" />
                    채널 추가하기
                </a>
                <a href="#" class="button" onClick={kakaoChatClick}>
                    <img src="/img/customer_center/kakaotalk_white.png" />
                    1:1 채팅 상담
                </a>
                <a href="#" class="button">
                    <img src="/img/customer_center/board_icon.png" />
                    <Link to="/Customer_center/qna">문의글 작성</Link>
                </a>
                <a href="#" class="button">
                    <img src="/img/customer_center/qna_icon.png" />
                    <Link to="/Customer_center/faq">자주묻는 질문</Link>
                </a>
            </div>

            <Outlet />
        </>
    );
};

export default CenterNav;
