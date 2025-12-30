import "./App.css";
import { Routes, Route } from "react-router-dom";
import ChatPage from "./pages/ChatPage";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import { ChatLayout } from "./pages/ChatLayout";
import VerificationPage from "./pages/VerificationPage";
import Error from "./pages/Error";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route path="/error" element={<Error />}></Route>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/verify" element={<VerificationPage />} />

      <Route element = {<ProtectedRoute/>}>
        <Route path="/" element={<ChatLayout />}>
        <Route path="chat/:conversationId" element={<ChatPage />} />
      </Route>
      </Route>
    </Routes>
  );
}

export default App;
