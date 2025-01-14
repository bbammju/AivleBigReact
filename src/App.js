import Login from "./pages/Login";
// import Main from './pages/Main';
// import Searchreview from './pages/Searchreview'
// import Searchuser from './pages/Searchuser'
import {BrowserRouter, Route, Routes} from 'react-router-dom'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login/>}/>
        {/* <Route path="/main" element={<Main/>}/>
        <Route path="/search/review" element={<Searchreview/>}/>
        <Route path="/search/user" element={<Searchuser/>}/> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;