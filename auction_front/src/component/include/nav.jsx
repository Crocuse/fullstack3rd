import React from "react";
import { Link } from "react-router-dom";

function Nav() {
    return (
        <nav>
            <ul>
                <li>
                    <Link to="/">BidBird logo img</Link> &nbsp;&nbsp;&nbsp;&nbsp;
                    <Link to="/auction/Current_list">진행중경매</Link> &nbsp;&nbsp;
                    <Link to="/action/Regist_form">경매등록</Link>&nbsp;&nbsp;
                    <Link to="/member/Point_add_form">포인트충전</Link>&nbsp;&nbsp;
                    <Link to="/member/Mypage">마이페이지</Link>&nbsp;&nbsp;
                    <Link to="/Customer_center">고객센터</Link>&nbsp;&nbsp;
                    <Link >알람</Link>&nbsp;&nbsp;&nbsp;&nbsp;
                    <Link to="/member/Signup_form">회원가입</Link>&nbsp;&nbsp;
                    <Link to="/member/Login_form">로그인</Link>&nbsp;&nbsp;
                </li>

            </ul>

        </nav>
    );
}

export default Nav;