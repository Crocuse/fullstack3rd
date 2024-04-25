
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import React from 'react';

import './App.css';
import Nav from './component/include/nav';
import Footer from './component/include/footer';
import Header from './component/include/header';
import Home from './component/Home';
import CstCT from './component/customer_center';
import CurList from './component/Auction/current_list';
import RegForm from './component/Auction/regist_form';
import PointAdd from './component/member/point_add_form';
import MyPage from './component/member/mypage'
import SignUp from './component/member/signup_form'
import Login from './component/member/login_form'


function App() {
  return (
    <>
      <BrowserRouter>
        <Header />
        <Nav />
        <Routes>
          <Route path='/' element={<Home/>}></Route>
          <Route path='/auction/current_list' element={<CurList/>}></Route>
          <Route path='/action/regist_form' element={<RegForm/>}></Route>
          <Route path='/member/point_add_form' element={<PointAdd/>}></Route>
          <Route path='/member/mypage' element={<MyPage/>}></Route>
          <Route path='/customer_center' element={<CstCT/>}></Route>
          <Route path='/member/signup_form' element={<SignUp/>}></Route>
          <Route path='/member/login_form' element={<Login/>}></Route>
        </Routes>
        <Footer />
      </BrowserRouter>


      HOME~~
      <a href='http://localhost:3001/node'>go node</a>
    </>

  );
}

export default App;