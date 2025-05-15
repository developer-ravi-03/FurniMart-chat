import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Register from "./pages/Register";
import { UserData } from "./context/UserContext";
import AdminChatPage from "./pages/AdminChatPage";
import Logout from "./pages/Logout";
import CustomerChatPage from "./pages/CustomerChatPage";

function App() {
  const { isAuth, user } = UserData();
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={!isAuth ? <Register /> : <Home />} />
        <Route path="/login" element={!isAuth ? <Login /> : <Home />} />
        <Route path="/" element={isAuth ? <Home /> : <Login />} />
        <Route
          path="/admin/chats"
          element={
            isAuth && (user?.role === "admin" || user?.role === "support") ? (
              <AdminChatPage />
            ) : (
              <Home />
            )
          }
        />
        <Route
          path="/chat/:chatId"
          element={
            isAuth && user?.role === "customer" ? (
              <CustomerChatPage />
            ) : (
              <Home />
            )
          }
        />
        <Route path="/logout" element={isAuth ? <Logout /> : <Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
