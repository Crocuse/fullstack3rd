import React from "react";
import { Link } from "react-router-dom";

function Nav() {
    return (
        <nav>
            <ul>
                <li>
                    <Link to="/">BidBird logo img</Link> &nbsp;&nbsp;&nbsp;&nbsp;
                    <Link to="/auction/current_list">진행중경매</Link> &nbsp;&nbsp;
                    <Link to="/action/regist_form">경매등록</Link>&nbsp;&nbsp;
                    <Link to="/member/point_add_form">포인트충전</Link>&nbsp;&nbsp;
                    <Link to="/member/mypage">마이페이지</Link>&nbsp;&nbsp;
                    <Link to="/customer_center">고객센터</Link>&nbsp;&nbsp;
                    <Link >알람</Link>&nbsp;&nbsp;&nbsp;&nbsp;
                    <Link to="/member/signup_form">회원가입</Link>&nbsp;&nbsp;
                    <Link to="/member/login_form">로그인</Link>&nbsp;&nbsp;
                </li>

            </ul>

        </nav>
    );
}

export default Nav;