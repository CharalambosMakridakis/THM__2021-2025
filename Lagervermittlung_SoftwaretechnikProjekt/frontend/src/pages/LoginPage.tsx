import React, { useState } from "react";
import { Form, Button, Container, Row, Col, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { intToUserTypeString, setLocalStorage } from "../Auth";

export default function LoginPage() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  const sendLoginRequest = async () => {
    try {
      const response = await fetch("http://localhost:8080/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        data.userType = intToUserTypeString(data.userType);
        setLocalStorage(data);
        navigate("/" + data.userType);
      } else {
        setError("Fehler bei der Anmeldung.");
      }
    } catch (error) {
      setError("Fehler bei der Anmeldung.");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Bitte alle Felder ausfüllen.");
      return;
    }

    sendLoginRequest();
  };

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Row>
        <Col md={12}>
          <h1 className="text-center">Willkommen zurück</h1>
          <Form onSubmit={handleSubmit} className="border p-4 rounded shadow">
            {error && <Alert variant="danger">{error}</Alert>}
            <Form.Group controlId="formEmail">
              <Form.Label>Email*</Form.Label>
              <Form.Control
                type="email"
                placeholder="Gib deine E-Mail ein"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId="formPassword" className="mt-3">
              <Form.Label>Passwort*</Form.Label>
              <Form.Control
                type="password"
                placeholder="Gib dein Passwort ein"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100 mt-4">
              Anmeldung
            </Button>
          </Form>
          <div className="text-center mt-3">
            <Link to="/register" className="text-muted">
              Hier registrieren
            </Link>
          </div>
        </Col>
      </Row>
    </Container>
  );
}
