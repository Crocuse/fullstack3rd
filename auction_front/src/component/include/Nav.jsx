import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { SERVER_URL } from '../../config/server_url';
import AuctionAlarm from '../alarm/AuctionAlarm';

axios.defaults.withCredentials = true;

function Nav() {
    // Hook -----------------------------------------------------------------------------------------------------------------
    const sessionId = useSelector((state) => state['loginedInfos']['loginedId']['sessionId']);
    const loginedAdmin = useSelector((state) => state['loginedInfos']['loginedId']['loginedAdmin']);
    const loginedUser = useSelector((state) => state['loginedInfos']['loginedId']['loginedId']);
    const alarmId = useSelector((state) => state.notificationOverBid.message.id);
    const alarmInfo = useSelector(state => state.alarmInfo);
    const [isAdminMenuOpen, setIsAdminMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [isAuctionMenuOpen, setIsAuctionMenuOpen] = useState(false);
    const [showAlarm, setShowAlarm] = useState(false);
    const [showBadge, setShowBadge] = useState(false);

    useEffect(() => {
        axios_session_check();
        console.log('showBadge: ====>', showBadge);
        console.log('loginedUser: ====>', loginedUser);
        console.log('alarmId: ====>', alarmId);

    }, [sessionId]);


    useEffect(() => {
        unReadAlarm()
    }, [alarmInfo]);

    const navigate = useNavigate();

    const toggleAlarm = () => {
        setShowAlarm(!showAlarm);
    };


    let mainMenu;
    let m_menu;

    // axios -----------------------------------------------------------------------------------------------------------------
    async function axios_session_check() {
        try {
            const response = await axios.post(`${SERVER_URL.SERVER_URL()}/member/session_check`, { sessionId });

            console.log(response.data);

            if (sessionId == '') return;
            else if (response.data == 'session incorrect') {
                navigate('/member/logout_confirm');
                return;
            }
        } catch (error) {
            console.log(error);
        }
    }
    // badge -----------------------------------------------------------------------------------------------------------------
    const unReadAlarm = () => {
        if (alarmInfo.length > 0) {
            const hasUnReadAlarm = alarmInfo.some(alarmInfo => alarmInfo.AOB_READ === 0);
            if (hasUnReadAlarm) {
                setShowBadge(true);
                console.log('새로운 알람');

            } else {
                setShowBadge(false);
                console.log('새로운 알람 없음');

            }

        } else {
            setShowBadge(false);
            console.log('새로운 알람 없음');
        }
    }
    // Toggle functions ------------------------------------------------------------------------------------------------------
    const toggleAdminMenu = () => setIsAdminMenuOpen(!isAdminMenuOpen);
    const toggleUserMenu = () => setIsUserMenuOpen(!isUserMenuOpen);
    const toggleAuctionMenu = () => setIsAuctionMenuOpen(!isAuctionMenuOpen);

    // view -----------------------------------------------------------------------------------------------------------------
    if (loginedAdmin == 'super') {
        mainMenu = (
            <>
                <Link to="/admin/home">어드민 홈</Link>
                <div className="menu-item" onClick={toggleAdminMenu}>
                    어드민 관리
                    {isAdminMenuOpen && (
                        <div className="submenu">
                            <Link to="/admin/AdminReg">어드민 등록</Link>
                            <Link to="/admin/admin_mgt">어드민 관리</Link>
                        </div>
                    )}
                </div>
                <Link to="/admin/user_mgt">유저 관리</Link>
                <div className="menu-item" onClick={toggleAuctionMenu}>
                    경매 관리
                    {isAuctionMenuOpen && (
                        <div className="submenu">
                            <Link to="/admin/auction_goods_mgt">경매 신청 물품 관리</Link>
                            <Link to="/admin/auction_goods_reg">경매 물품 등록</Link>
                            <Link to="/admin/auction_result">경매 결과 조회</Link>
                        </div>
                    )}
                </div>
                <Link to="/admin/sales_mgt">매출 관리</Link>
                <Link to="/admin/qna">문의글 관리</Link>
            </>
        );

        m_menu = (
            <>
                <Link to="/member/logout_confirm">로그아웃</Link>
            </>
        );
    } else if (loginedAdmin == 'admin') {
        mainMenu = (
            <>
                <Link to="/admin/home">어드민 홈</Link>
                <div className="menu-item" onClick={toggleUserMenu}>
                    유저 관리
                    {isUserMenuOpen && (
                        <div className="submenu">
                            <Link to="/admin/user_mgt">유저 관리</Link>
                        </div>
                    )}
                </div>
                <div className="menu-item" onClick={toggleAuctionMenu}>
                    경매 관리
                    {isAuctionMenuOpen && (
                        <div className="submenu">
                            <Link to="/admin/auction_goods_mgt">경매 신청 물품 관리</Link>
                            <Link to="/admin/auction_goods_reg">경매 물품 등록</Link>
                            <Link to="/admin/auction_result">경매 결과 조회</Link>
                        </div>
                    )}
                </div>
                <Link to="/admin/sales_mgt">매출 관리</Link>
                <Link to="/admin/qna">문의글 관리</Link>
            </>
        );

        m_menu = (
            <>
                <Link to="/member/logout_confirm">로그아웃</Link>
            </>
        );
    } else if (loginedUser != '') {
        mainMenu = (
            <>
                <Link to="/auction/Current_list">진행중경매</Link>
                <Link to="/auction/Regist_form">경매등록</Link>
                <Link to="/point/Point_add_form">포인트충전</Link>
                <Link to="/Customer_center">고객센터</Link>
            </>
        );

        m_menu = (
            <>
                <div className="drop_down_wrap">
                    <Link
                        to="#"
                        id="bell_wrap"
                        onClick={(e) => {
                            e.preventDefault();
                            toggleAlarm();
                        }}
                    >
                        <div className={showAlarm ? 'drop_down_content' : 'drop_down_content hidden'}>
                            <AuctionAlarm />
                        </div>
                        <img src="/img/bell.png" id="bell_img" />
                        {showBadge && <div className="badge"></div>}
                    </Link>
                </div>
                <Link to="/member/my_page/modify_info">마이페이지</Link>
                <Link to="/member/logout_confirm">로그아웃</Link>
            </>
        );
    } else {
        mainMenu = (
            <>
                <Link to="/auction/Current_list">진행중경매</Link>
                <Link to="/auction/Regist_form">경매등록</Link>
                <Link to="/point/Point_add_form">포인트충전</Link>
                <Link to="/Customer_center">고객센터</Link>
            </>
        );

        m_menu = (
            <>
                <Link to="/member/signup_form">회원가입</Link>
                <Link to="/member/login_form">로그인</Link>
            </>
        );
    }

    return (
        <nav>
            <div className="nav_wrap">
                <ul>
                    <li>
                        <div className="main_menu">{mainMenu}</div>
                        <div className="m_menu">{m_menu}</div>
                    </li>
                </ul>
            </div>
        </nav>
    );
}

export default Nav;
