import { Link, Outlet } from "react-router-dom";

const MyPageMenubar = () => {
    return (
        <>
            <div className="menubar">
                <Link to="/member/member/my_page/modify_info">      내정보 수정     </Link >
                <Link to="/member/member/my_page/modify_password">  비밀번호 변경   </Link >
                <Link to="/member/member/my_page/mybids">           입찰 내역       </Link >
                <Link to="/member/member/my_page/mywinnigbids">     낙찰 내역       </Link >
                <Link to="/member/member/my_page/myregist">         상품 등록 내역  </Link >
                <Link to="/member/member/my_page/mypoint">          포인트 내역     </Link >
            </div>
            
            <Outlet />
        </>
    )
}

export default MyPageMenubar;