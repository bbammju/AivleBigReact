import React from 'react';
import InputModal from './pages/InputModal'; // InputModal 컴포넌트를 import
import RsltList from './pages/RsltList';
import GuModal from "./components/guModal";
import { BrowserRouter, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<InputModal />} />
        <Route path="/list" element={<RsltList />} />
        <Route path="/list1" element={<GuModal />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;