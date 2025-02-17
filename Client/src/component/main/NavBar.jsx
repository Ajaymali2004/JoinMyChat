import { useContext, useEffect } from "react";
import { Navbar, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../Context/UserContext";

export default function NavBar() {
  const { user, logout } = useContext(UserContext);
  const navigate = useNavigate();
  const logOut = () => {
    navigate("/");
    logout();
  };
  return (
    <div className="">
      <Navbar className="position-absolute top-0 end-0 p-3">
        {user ? (
          <div className="d-flex align-items-center gap-3">
            <span className="fs-5 fw-semibold">Welcome, {user}</span>
            <Button variant="warning" size="lg" onClick={logOut}>
              Logout
            </Button>
          </div>
        ) : (
          <Button
            variant="success"
            size="lg"
            onClick={() => navigate("/login")}
          >
            Login / Register
          </Button>
        )}
      </Navbar>
    </div>
  );
}
