
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import React from 'react';

import './App.css';
import Nav from './component/include/nav';
import Footer from './component/include/footer';
import Header from './component/include/header';

function App() {
  return (
    <>
      <BrowserRouter>
        <Header />
        <Nav />
        <Footer />
      </BrowserRouter>


      HOME~~
      <a href='http://localhost:3001/node'>go node</a>
    </>

  );
}

export default App;