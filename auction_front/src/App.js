
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { Provider } from 'react-redux';
import { legacy_createStore } from 'redux';
import { reducer } from './redux/reducer/reducer';

import './App.css';
import Nav from './component/include/Nav';
import Footer from './component/include/Footer';
import Header from './component/include/Header';
import Home from './component/Home';
import CstCT from './component/Customer_center';
import CurList from './component/Auction/Current_list';
import RegForm from './component/Auction/Regist_form';
import PointAdd from './component/member/PointAddForm';
import MyPage from './component/member/MyPage' 
import SignUp from './component/member/SignUpForm'
import Login from './component/member/LoginForm'
import Logout from './component/member/Logout';
import AdminReg from './component/Admin/AdminReg'
import AdminHome from './component/Admin/AdminHome'
import AuctionGoodsMgt from './component/Admin/AuctionGoodsMgt'
import AuctionGoodsReg from './component/Admin/AuctionGoodsReg'
import AuctionResult from './component/Admin/AuctionResult'
import ReciveGoodsMgt from './component/Admin/ReciveGoodsMgt'
import SalesMgt from './component/Admin/SalesMgt'
import UserMgt from './component/Admin/UserMgt'
import AdminMgt from './component/Admin/AdminMgt'


function App() {
  // Hook ------------------------------------------------------------------------------------------------------
  const store = legacy_createStore(reducer);
  
  // Veiw ------------------------------------------------------------------------------------------------------
  return (
	<>
    <Provider store={store}>
      <BrowserRouter>
        <Header />
        <Nav />
        <Routes>
          <Route path='/' element={<Home />}></Route>
          <Route path='/auction/Current_list' element={<CurList />}></Route>
          <Route path='/action/Regist_form' element={<RegForm />}></Route>
          <Route path='/member/Signup_form' element={<SignUp />}></Route>
          <Route path='/member/Login_form' element={<Login />}></Route>
          <Route path='/member/Logout_confirm' element={<Logout />}></Route>
          <Route path='/member/Point_add_form' element={<PointAdd />}></Route>
          <Route path='/member/MyPage' element={<MyPage />}></Route>
          <Route path='/Customer_center' element={<CstCT />}></Route>
          <Route path='/admin/home' element={<AdminHome />}></Route>
          <Route path='/admin/AdminReg' element={<AdminReg />}></Route>
          <Route path='/admin/auction_goods_mgt' element={<AuctionGoodsMgt />}></Route>
          <Route path='/admin/auction_goods_reg' element={<AuctionGoodsReg />}></Route>
          <Route path='/admin/auction_result' element={<AuctionResult />}></Route>
          <Route path='/admin/recive_goods_mgt' element={<ReciveGoodsMgt />}></Route>
          <Route path='/admin/sales_mgt' element={<SalesMgt />}></Route>
          <Route path='/admin/user_mgt' element={<UserMgt />}></Route>
          <Route path='/admin/admin_mgt' element={<AdminMgt />}></Route>

        </Routes>
        <Footer />
      </BrowserRouter>
	</Provider>


      <a href='http://localhost:3001/node'></a>
    </>

  );
}

export default App;