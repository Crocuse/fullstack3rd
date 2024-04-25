
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import React from 'react';

import './App.css';
import Nav from './component/include/Nav';
import Footer from './component/include/Footer';
import Header from './component/include/Header';
import Home from './component/Home';
import CstCT from './component/Customer_center';
import CurList from './component/Auction/Current_list';
import RegForm from './component/Auction/Regist_form';
import PointAdd from './component/member/PointAddForm';
import MyPage from './component/member/Mypage'
import SignUp from './component/member/SignUpForm'
import Login from './component/member/LoginForm'


function App() {
  return (
    <>
      <BrowserRouter>
        <Header />
        <Nav />
        <Routes>
          <Route path='/' element={<Home/>}></Route>
          <Route path='/auction/Current_list' element={<CurList/>}></Route>
          <Route path='/action/Regist_form' element={<RegForm/>}></Route>
          <Route path='/member/Point_add_form' element={<PointAdd/>}></Route>
          <Route path='/member/Mypage' element={<MyPage/>}></Route>
          <Route path='/Customer_center' element={<CstCT/>}></Route>
          <Route path='/member/Signup_form' element={<SignUp/>}></Route>
          <Route path='/member/Login_form' element={<Login/>}></Route>
        </Routes>
        <Footer />
      </BrowserRouter>


      HOME~~
      <a href='http://localhost:3001/node'>go node</a>
    </>

  );
}

export default App;