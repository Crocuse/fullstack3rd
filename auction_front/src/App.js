import { Provider } from 'react-redux';
import { BrowserRouter, Route, Routes, Navigate, Outlet } from 'react-router-dom';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, store } from './redux/store';

import './App.css';

// 폰트어썸
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';

import AdminHome from './component/Admin/AdminHome';
import AdminMgt from './component/Admin/AdminMgt';
import AdminReg from './component/Admin/AdminReg';
import AuctionGoodsMgt from './component/Admin/AuctionGoodsMgt';
import AuctionGoodsReg from './component/Admin/AuctionGoodsReg';
import AuctionResult from './component/Admin/AuctionResult';
import SalesMgt from './component/Admin/SalesMgt';
import UserMgt from './component/Admin/UserMgt';
import CurList from './component/Auction/CurrentList';
import RegForm from './component/Auction/RegistForm';
import AuctionPage from './component/Auction/AuctionPage';
import CstCT from './component/Customer_center/Customer_center';
import Home from './component/Home';
import Footer from './component/include/Footer';
import Header from './component/include/Header';
import Nav from './component/include/Nav';
import GoogleLogin from './component/member/GoogleLogin';
import Login from './component/member/LoginForm';
import Logout from './component/member/Logout';
import NaverLogin from './component/member/NaverLogin';
import SignUp from './component/member/SignUpForm';
import ModifyInfo from './component/member/mypage/ModifyInfo';
import ModifyPassword from './component/member/mypage/ModifyPassword';
import MySells from './component/member/mypage/MySells';
import MyPage from './component/member/mypage/MyPage';
import MyPageMenubar from './component/member/mypage/MyPageMenubar';
import MyPoint from './component/member/mypage/MyPoint';
import MyRegist from './component/member/mypage/MyRegist';
import MyWinnigBids from './component/member/mypage/MyWinnigBids';
import PayAPI from './component/point/PayAPI';
import PointAddForm from './component/point/PointAddForm';
import AuctionAlarm from './component/alarm/AuctionAlarm';
import FindId from './component/member/FindId';
import FindPw from './component/member/FindPw';
import MemberDelete from './component/member/mypage/MemberDelete';
import Qna from './component/Customer_center/Qna';
import Faq from './component/Customer_center/Faq';
import CenterNav from './component/Customer_center/CenterNav';
import TopArrow from './component/include/TopArrow';
import QnaAwnser from './component/Admin/QnaAwnser';
import KakaoLogin from './component/member/KakaoLogin';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AlarmModal from './component/alarm/AlarmModal';

function App() {
    // 폰트어썸 적용
    library.add(fas);

    // 리액트 쿼리
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                refetchOnWindowFocus: false,
                refetchOnMount: false,
                refetchOnReconnect: false,
            },
        },
    });

    return (
        <>
            <QueryClientProvider client={queryClient}>
                <Provider store={store}>
                    <PersistGate loading={null} persistor={persistor}>
                        <BrowserRouter>
                            <Routes>
                                <Route path="/auth/google/callback" element={<GoogleLogin />}></Route>
                                <Route path="/auth/naver/callback" element={<NaverLogin />}></Route>
                                <Route path="/auth/kakao/callback" element={<KakaoLogin />}></Route>

                                <Route path="/" element={<Layout />}>
                                    <Route index element={<Home />} />
                                    <Route path="/auction/current_list" element={<CurList />}></Route>
                                    <Route path="/auction/regist_form" element={<RegForm />}></Route>
                                    <Route path="/auction/auction_page" element={<AuctionPage />}></Route>
                                    <Route path="/member/Signup_form" element={<SignUp />}></Route>
                                    <Route path="/member/Login_form" element={<Login />}></Route>
                                    <Route path="/member/Logout_confirm" element={<Logout />}></Route>
                                    <Route path="/member/my_page" element={<MyPage />}>
                                        <Route path="" element={<MyPageMenubar />}>
                                            <Route path="modify_info" element={<ModifyInfo />} />
                                            <Route path="modify_password" element={<ModifyPassword />} />
                                            <Route path="mysells" element={<MySells />} />
                                            <Route path="mywinnigbids" element={<MyWinnigBids />} />
                                            <Route path="myregist" element={<MyRegist />} />
                                            <Route path="mypoint" element={<MyPoint />} />
                                            <Route path="member_delete" element={<MemberDelete />} />
                                        </Route>
                                    </Route>

                                    <Route path="/point/Point_add_form" element={<PointAddForm />}></Route>
                                    <Route path="/point/PayAPI" element={<PayAPI />} />
                                    <Route path="/alarm/AuctionAlarm" element={<AuctionAlarm />} />
                                    <Route path="/admin/home" element={<AdminHome />}></Route>
                                    <Route path="/admin/AdminReg" element={<AdminReg />}></Route>
                                    <Route path="/admin/Qna" element={<QnaAwnser />}></Route>
                                    <Route path="/admin/auction_goods_mgt" element={<AuctionGoodsMgt />}></Route>
                                    <Route path="/admin/auction_goods_reg" element={<AuctionGoodsReg />}></Route>
                                    <Route path="/admin/auction_result" element={<AuctionResult />}></Route>
                                    <Route path="/admin/sales_mgt" element={<SalesMgt />}></Route>
                                    <Route path="/admin/user_mgt" element={<UserMgt />}></Route>
                                    <Route path="/admin/admin_mgt" element={<AdminMgt />}></Route>
                                    <Route path="/Customer_center" element={<CstCT />}>
                                        <Route path="" element={<CenterNav />}>
                                            <Route path="qna" element={<Qna />} />
                                            <Route path="faq" element={<Faq />} />
                                        </Route>
                                    </Route>
                                </Route>

                                <Route path="/member/find_id" element={<FindId />} />
                                <Route path="/member/find_pw" element={<FindPw />} />

                                {/* 잘못된 경로에 대해서는 / 경로로 리다이렉트 */}
                                <Route path="*" element={<Navigate to="/" replace />} />
                            </Routes>
                            <AlarmModal />
                        </BrowserRouter>
                    </PersistGate>
                </Provider>
                <TopArrow />
            </QueryClientProvider>
        </>
    );
}

const Layout = () => (
    <>
        <Header />
        <Nav />
        <Outlet />
        <Footer />
    </>
);

export default App;
