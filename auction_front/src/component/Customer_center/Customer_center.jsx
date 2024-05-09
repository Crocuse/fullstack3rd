import React from 'react';
import '../../css/Customer_center/Customer_center.css';
import { Outlet } from 'react-router-dom';

function customer_center() {
    return (
        <article>
            <div className="customer_center_wrap">
                <div class="header">
                    <div className="bidbird_img">
                        <img src="/img/customer_center/bid_bird_center.png" alt="" />
                    </div>
                    <h1>비드버드 고객센터</h1>
                    <div className="bidbird_info">
                        <p>전화 : 031-123-4567</p>
                        <p>이메일 : bidbird_bidbird@gmail.com</p>
                        <p>카카오톡 채널 : '@비드버드' 검색</p>
                    </div>
                </div>

                <div class="main">
                    <div class="hero">
                        <h2>무엇을 도와드릴까요?</h2>
                        <p>고객님의 불편사항이나 궁금증을 해결해 드리겠습니다.</p>
                        <Outlet />
                    </div>

                    <div class="guide">
                        <p>상담을 통해 시 진문 상담사가 배정되어 빠르고 친절하게 안내해 드립니다.</p>
                    </div>
                </div>
            </div>
        </article>
    );
}
export default customer_center;
