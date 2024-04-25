import React from "react";

function Nav() {
    return (
        <nav>
            <ul>
                <li>
                    <a href="#">BidBird logo img</a> &nbsp;&nbsp;&nbsp;&nbsp;
                    <a href="/auction/current_list">진행중경매</a> &nbsp;&nbsp;
                    <a href="/action/regist_form">경매등록</a>&nbsp;&nbsp;
                    <a href="/member/point_add_form">포인트충전</a>&nbsp;&nbsp;
                    <a href="/member/mypage">마이페이지</a>&nbsp;&nbsp;
                    <a href="/customer_center">고객센터</a>&nbsp;&nbsp;
                    <a href="#">알람</a>&nbsp;&nbsp;&nbsp;&nbsp;
                    <a href="/member/signup_form">회원가입</a>&nbsp;&nbsp;
                    <a href="/member/login_form">로그인</a>&nbsp;&nbsp;
                </li>

            </ul>

        </nav>
    );
}

export default Nav;