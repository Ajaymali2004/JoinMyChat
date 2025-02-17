import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./component/AuthPage/Login";
import Register from "./component/AuthPage/Register";
import Home from "./component/main/Home";
import Room from "./component/main/Room";
import Tmp from "./Tmp";
import NavBar from "./component/main/NavBar";
import { Container } from "react-bootstrap";
import { UserProvider } from "./component/Context/UserContext";

function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <NavBar />
        <Container fluid className="max-vh-100 d-flex flex-column justify-content-center align-items-center px-3">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/room/:roomKey" element={<Room />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/check" element={<Tmp />} />
          </Routes>
        </Container>
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;
