import { useEffect, useState, useRef, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { Container, Card, Form, Button, Alert } from "react-bootstrap";
import validateRoom, { verify } from "./validateRoom";
import { UserContext } from "../Context/UserContext";


const Room = () => {
  const BACKEND_URI = import.meta.env.VITE_BACKEND_URI;
  const { roomKey } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [socket, setSocket] = useState(null);
  const { user } = useContext(UserContext);
  const [username, setUsername] = useState(
    localStorage.getItem("username") | "Unkown"
  );
  const [copied, setCopied] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const verifyUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }
      const veri = await verify(user, token);
      if (!veri) {
        navigate("/login");
      } else {
        setUsername(user);
      }
    };
    const verifyRoom = async () => {
      const isValidRoom = await validateRoom(roomKey);
      if (!isValidRoom) {
        alert("Invalid room key. Please try again.");
        navigate("/");
      }
    };

    const handleSocket = () => {
      const socketConnection = io(BACKEND_URI);
      setSocket(socketConnection);

      socketConnection.emit("joinRoom", { room: roomKey, username });

      socketConnection.on("PrevMessages", (chatHistory) => {
        setMessages(chatHistory);
        scrollToBottom();
      });

      socketConnection.on("chatMessage", (message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
        scrollToBottom();
      });

      return () => {
        socketConnection.disconnect();
      };
    };

    verifyUser();
    verifyRoom();
    handleSocket();
  }, [roomKey, navigate]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const messageData = { room: roomKey, message: newMessage, username };
      socket.emit("chatMessage", messageData);
      setNewMessage("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  const handleCopyRoomId = () => {
    navigator.clipboard.writeText(roomKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <Container
  className="d-flex flex-column py-4 text-white align-items-center"
  style={{ minHeight: "100vh" }} // Ensuring full height
  fluid
>
  <Card
    className="p-4 shadow-lg w-100 d-flex flex-column"
    style={{ maxWidth: "600px", height: "80vh" }} // Fixed chat box height
  >
    <Card.Header className="bg-success text-white text-center font-weight-bold d-flex justify-content-between">
      <span
        className="cursor-pointer"
        onClick={handleCopyRoomId}
        style={{ cursor: "pointer" }}
      >
        {copied ? "Copied!" : "Room Key (tap to copy)"}
      </span>
      <Button variant="danger" size="sm" onClick={() => navigate("/")}>
        Leave Room
      </Button>
    </Card.Header>

    <Card.Body
      className="overflow-auto bg-light text-dark flex-grow-1 d-flex flex-column"
      style={{ height: "100%", maxHeight: "calc(100% - 60px)" }}
    >
      <div className="d-flex flex-column justify-content-start">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`d-flex mb-2 ${
              msg.username === username
                ? "justify-content-end"
                : "justify-content-start"
            }`}
          >
            <Alert
              variant={msg.username === username ? "primary" : "secondary"}
              className="mb-0 text-break w-auto"
              style={{ maxWidth: "75%" }}
            >
              <strong
                className={
                  msg.username === username ? "text-success" : "text-primary"
                }
              >
                {msg.username === username ? "You" : msg.username}:
              </strong>{" "}
              {msg.message}
            </Alert>
          </div>
        ))}
        <div ref={messagesEndRef}></div>
      </div>
    </Card.Body>

    <Card.Footer className="bg-white">
      <Form.Group className="d-flex">
        <Form.Control
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          className="flex-grow-1"
        />
        <Button variant="primary" className="ms-2" onClick={handleSendMessage}>
          Send
        </Button>
      </Form.Group>
    </Card.Footer>
  </Card>
</Container>

  );
};

export default Room;
