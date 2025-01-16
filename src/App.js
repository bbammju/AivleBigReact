import React from 'react';
import InputModal from './pages/InputModal'; // InputModal 컴포넌트를 import
import { BrowserRouter, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 기본 경로("/")에 InputModal 컴포넌트를 렌더링 */}
        <Route path="/" element={<InputModal />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;