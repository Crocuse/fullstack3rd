import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

function Nav() {
    const loginedAdmin = useSelector(state => state['loginedInfos']['loginedId']['loginedAdmin']);
    const loginedUser = useSelector(state => state['loginedInfos']['loginedId']['loginedId']);
    let mainMenu;
    let m_menu;

    if (loginedAdmin == 'super') {
        mainMenu = 
        <>
            <Link to="/admin/home">어드민 홈</Link>          
            <Link to="/admin/AdminReg">어드민 등록</Link>          
            <Link to="/admin/admin_mgt">어드민 관리</Link>          
            <Link to="/admin/user_mgt">유저 관리</Link>          
            <Link to="/admin/auction_goods_reg">경매 물품 등록</Link>          
            <Link to="/admin/auction_goods_mgt">경매 신청 물품 관리</Link>          
            <Link to="/admin/auction_result">경매 결과 조회</Link>          
            <Link to="/admin/recive_goods_mgt">수령 대기 물품 관리</Link>          
            <Link to="/admin/sales_mgt">매출 관리</Link>          
        </>;

        m_menu = 
        <>
            <Link to="/member/logout_confirm">로그아웃</Link>
        </>
    }
    else if (loginedAdmin == 'admin') {
        mainMenu = 
        <>
            <Link to="/admin/home">어드민 홈</Link>               
            <Link to="/admin/user_mgt">유저 관리</Link>          
            <Link to="/admin/auction_goods_reg">경매 물품 등록</Link>          
            <Link to="/admin/auction_goods_mgt">경매 신청 물품 관리</Link>          
            <Link to="/admin/auction_result">경매 결과 조회</Link>          
            <Link to="/admin/recive_goods_mgt">수령 대기 물품 관리</Link>          
            <Link to="/admin/sales_mgt">매출 관리</Link>  
        </>;

        m_menu = 
        <>
            <Link to="/member/logout_confirm">로그아웃</Link>
        </>
    }
    else if (loginedUser != '') {
        mainMenu = 
        <>
            <Link to="/auction/Current_list">진행중경매</Link>
            <Link to="/action/Regist_form">경매등록</Link>
            <Link to="/point/Point_add_form">포인트충전</Link>
            <Link to="/Customer_center">고객센터</Link>
        </>;

        m_menu = 
        <>
            <Link ><img src="/img/bell.png" id="bell_img" /></Link>
            <Link to="/member/Mypage">마이페이지</Link>
            <Link to="/member/logout_confirm">로그아웃</Link>
        </>
        
    }
    else {
        mainMenu = 
        <>
            <Link to="/auction/Current_list">진행중경매</Link>
            <Link to="/action/Regist_form">경매등록</Link>
            <Link to="/point/Point_add_form">포인트충전</Link>
            <Link to="/Customer_center">고객센터</Link>
        </>;

        m_menu = <>
            <Link to="/member/signup_form">회원가입</Link>
            <Link to="/member/login_form">로그인</Link>
        </>
    }

        
    return (
        <nav>
            <ul>
                <li>
                    <span className="main_menu">
                        {mainMenu}                        
                    </span>
                    <span className="m_menu">
                        {m_menu}
                    </span>
                </li>
            </ul>
        </nav>
    );
}

export default Nav;