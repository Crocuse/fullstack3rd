import { Link, Outlet } from 'react-router-dom';
import '../../../css/member/mypage/Menubar.css';

const MyPageMenubar = () => {
    return (
        <>
            <div className="menubar_wrap">
                <Link to="modify_info"> 내정보 수정 </Link>
                <Link to="modify_password"> 비밀번호 변경 </Link>
                <Link to="myregist"> 경매 등록 신청 내역 </Link>
                <Link to="mysells"> 판매 내역 </Link>
                <Link to="mywinnigbids"> 낙찰 내역 </Link>
                <Link to="mypoint"> 포인트 내역 </Link>
                <Link to="member_delete"> 회원탈퇴 </Link>
            </div>

            <Outlet />
        </>
    );
};

export default MyPageMenubar;
