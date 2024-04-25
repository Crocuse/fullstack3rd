import React from "react";
import { Link } from "react-router-dom";

function Nav() {
    return (
        <nav>
            <ul>
                <li>
                    <span className="main_menu">
                        <Link to="/auction/Current_list">진행중경매</Link>
                        <Link to="/action/Regist_form">경매등록</Link>
                        <Link to="/member/Point_add_form">포인트충전</Link>
                        <Link to="/member/Mypage">마이페이지</Link>
                        <Link to="/Customer_center">고객센터</Link>
                    </span>
                    <span className="m_menu">
                        <Link ><img src="/img/bell.png" id="bell_img" /></Link>
                        <Link to="/member/Signup_form">회원가입</Link>
                        <Link to="/member/Login_form">로그인</Link>
                    </span>

                </li>

            </ul>
        </nav>
    );
}

export default Nav;