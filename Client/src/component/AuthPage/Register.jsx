import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Container, Alert, Card } from "react-bootstrap";
import { UserContext } from "../Context/UserContext";
import { verify } from "../main/validateRoom";
const BACKEND_URI = import.meta.env.VITE_BACKEND_URI;
const Register = () => {
  const { user,login } = useContext(UserContext);
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
      const verifyUser = async () => {
        const token = localStorage.getItem("token");
        const veri = await verify(user, token);
        if (veri) {
          navigate("/");
        }
      };
  
      verifyUser();
    }, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password.length < 6) {
      setMessage("Password must be at least 6 characters long");
      return;
    }

    try {
      const response = await fetch(BACKEND_URI+"/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const json = await response.json();
      if (!response.ok) throw new Error(json.error || "Registration failed");
      setMessage("Registration successful! Redirecting to login...");
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <Container className="d-flex mx-2 justify-content-center align-items-center vh-100">
      <Card
        className="p-4 shadow-lg"
        style={{ width: "30rem", maxWidth: "70%" }}
      >
        <h2 className="text-center">Sign Up</h2>
        <Form onSubmit={handleSubmit} className="mt-3">
          <Form.Group className="mb-3">
            <Form.Control
              type="text"
              name="username"
              placeholder="Username"
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Control
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
            />
          </Form.Group>
          <Button variant="primary" type="submit" className="w-100">
            Sign Up
          </Button>
        </Form>
        {message && (
          <Alert variant="danger" className="mt-3 text-center">
            {message}
          </Alert>
        )}
        <div className="text-center mt-3">
          <small>
            Already having an account?{" "}
            <a href="/login" className="text-primary fw-bold">
              Login
            </a>
          </small>
        </div>
      </Card>
    </Container>
  );
};

export default Register;
