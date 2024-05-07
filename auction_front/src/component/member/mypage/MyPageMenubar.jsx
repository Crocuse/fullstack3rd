import { Link, Outlet } from 'react-router-dom';
import '../../../css/member/mypage/Menubar.css';

const MyPageMenubar = () => {
    return (
        <>
            <div className="menubar_wrap">
                <Link to="/member/my_page/modify_info"> 내정보 수정 </Link>
                <Link to="/member/my_page/modify_password"> 비밀번호 변경 </Link>
                <Link to="/member/my_page/myregist"> 경매 등록 신청 내역 </Link>
                <Link to="/member/my_page/mysells"> 판매 내역 </Link>
                <Link to="/member/my_page/mywinnigbids"> 낙찰 내역 </Link>
                <Link to="/member/my_page/mypoint"> 포인트 내역 </Link>
                <Link to="/member/my_page/member_delete"> 회원탈퇴 </Link>
            </div>

            <Outlet />
        </>
    );
};

export default MyPageMenubar;
