import { Provider } from 'react-redux';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
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
import CstCT from './component/Customer_center';
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
import KakaoChat from './component/include/KakaoChat';
import AuctionAlarm from './component/alarm/AuctionAlarm';
import FindId from './component/member/FindId';
import FindPw from './component/member/FindPw';

function App() {
    // 폰트어썸 적용
    library.add(fas);

    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <BrowserRouter>
                    <Routes>
                        <Route
                            path="*"
                            element={
                                <>
                                    <Header />
                                    <Nav />
                                    <Routes>
                                        <Route path="/" element={<Home />}></Route>
                                        <Route path="/auction/current_list" element={<CurList />}></Route>
                                        <Route path="/auction/regist_form" element={<RegForm />}></Route>
                                        <Route path="/auction/auction_page" element={<AuctionPage />}></Route>
                                        <Route path="/member/Signup_form" element={<SignUp />}></Route>
                                        <Route path="/member/Login_form" element={<Login />}></Route>
                                        <Route path="/member/Logout_confirm" element={<Logout />}></Route>
                                        <Route path="/member/my_page" element={<MyPageMenubar />}>
                                            <Route path="modify_info" element={<ModifyInfo />} />
                                            <Route path="modify_password" element={<ModifyPassword />} />
                                            <Route path="mysells" element={<MySells />} />
                                            <Route path="mywinnigbids" element={<MyWinnigBids />} />
                                            <Route path="myregist" element={<MyRegist />} />
                                            <Route path="mypoint" element={<MyPoint />} />
                                        </Route>
                                        <Route path="/auth/google/callback" element={<GoogleLogin />}></Route>
                                        <Route path="/auth/naver/callback" element={<NaverLogin />}></Route>
                                        <Route path="/point/Point_add_form" element={<PointAddForm />}></Route>
                                        <Route path="/point/PayAPI" element={<PayAPI />} />
                                        <Route path="/alarm/AuctionAlarm" element={<AuctionAlarm />} />
                                        <Route path="/member/MyPage" element={<MyPage />}></Route>
                                        <Route path="/Customer_center" element={<CstCT />}></Route>
                                        <Route path="/admin/home" element={<AdminHome />}></Route>
                                        <Route path="/admin/AdminReg" element={<AdminReg />}></Route>
                                        <Route path="/admin/auction_goods_mgt" element={<AuctionGoodsMgt />}></Route>
                                        <Route path="/admin/auction_goods_reg" element={<AuctionGoodsReg />}></Route>
                                        <Route path="/admin/auction_result" element={<AuctionResult />}></Route>

                                        <Route path="/admin/sales_mgt" element={<SalesMgt />}></Route>
                                        <Route path="/admin/user_mgt" element={<UserMgt />}></Route>
                                        <Route path="/admin/admin_mgt" element={<AdminMgt />}></Route>
                                    </Routes>

                                    <Footer />
                                    <KakaoChat />
                                </>
                            }
                        />
                        <Route path="/member/find_id" element={<FindId />} />
                        <Route path="/member/find_pw" element={<FindPw />} />
                    </Routes>
                </BrowserRouter>
            </PersistGate>
        </Provider>
    );
}

export default App;
