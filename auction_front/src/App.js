import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Nav from './includ/nav';
import Footer from './includ/footer';
import Header from './includ/header';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Nav />
      <Footer />
    </BrowserRouter>
  );
}

export default App;
