import React from 'react';
import logo from './logo.svg';
import './App.css';
import Header from './Header/Header'
import Footer from './Footer/Footer'
import Content from './Content/Content'

function App() {
  return (
    <div className="App">
      <Header></Header>
      <Content></Content>
      <Footer></Footer>
    </div>
  );
}

export default App;
