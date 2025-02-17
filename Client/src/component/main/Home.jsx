import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Container, Form, InputGroup } from "react-bootstrap";
import { UserContext } from "../Context/UserContext";
import validateRoom from "./validateRoom";
import "./home.css"
const BACKEND_URI = import.meta.env.VITE_BACKEND_URI;
const Home = () => {
  const { user } = useContext(UserContext);
  const [roomKey, setRoomKey] = useState("");
  const navigate = useNavigate();

  const handleJoinRoom = async() => {
    const isvalid=await validateRoom(roomKey)
    if (isvalid===true) {
      navigate(`/room/${roomKey}`);
    } else {
      alert("Invalid room key. Please try again.");
    }
  };

  const handleCreateRoom = async () => {
    try {
      const response = await fetch(BACKEND_URI+"/rooms/create", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      const json = await response.json();
      if (!json.room) throw new Error(json.error || "Failed to create room");
      navigate(`/room/${json.room}`);
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <Container className="d-flex flex-column align-items-center justify-content-center home-container">
      <h1 className="fw-bold mb-4">Welcome to JoinChat</h1>

      {user ? (
        <div className="text-center">
          <Button
            className="mb-3"
            variant="success"
            size="lg"
            onClick={handleCreateRoom}
          >
            Create a Room
          </Button>
          <InputGroup className="mb-3">
            <Form.Control
              type="text"
              value={roomKey}
              onChange={(e) => setRoomKey(e.target.value)}
              placeholder="Enter Room Key"
            />
            <Button variant="primary" onClick={handleJoinRoom}>
              Join Room
            </Button>
          </InputGroup>
        </div>
      ) : (
        <div className="login-alert-container animate-fade-in">
          <h3 className="login-alert-title">Join the Conversation!</h3>
          <p className="login-alert-text">
            Log in to create or join a room and start chatting with friends.
          </p>
          <Button onClick={() => navigate("/login")}>Login Now</Button>
        </div>
      )}
    </Container>
  );
};

export default Home;
