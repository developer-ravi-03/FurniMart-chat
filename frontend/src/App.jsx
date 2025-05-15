import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Register from "./pages/Register";
import { UserData } from "./context/UserContext";

function App() {
  const { isAuth } = UserData();
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/register" element={!isAuth ? <Register /> : <Home />} />
          <Route path="/login" element={!isAuth ? <Login /> : <Home />} />
          <Route path="/" element={isAuth ? <Home /> : <Login />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
