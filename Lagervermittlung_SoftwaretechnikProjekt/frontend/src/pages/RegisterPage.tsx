import React, { useState } from "react";
import { Form, Button, Container, Row, Col, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { UserType } from "../Auth";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: string;
  phone: string;
  address: string;
  userType: string;
  password: string;
  confirmPassword: string;
}

export default function RegisterPage() {
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    dateOfBirth: "",
    phone: "",
    address: "",
    userType: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  const sendRegisterRequest = async () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { confirmPassword, ...requestData } = formData;
    try {
      const response = await fetch("http://localhost:8080/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      if (response.ok) {
        navigate("/");
      } else {
        setError("Fehler bei der Registrierung.");
      }
    } catch (error) {
      setError("Fehler bei der Registrierung.");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const {
      firstName,
      lastName,
      email,
      dateOfBirth,
      phone,
      address,
      userType,
      password,
      confirmPassword,
    } = formData;

    if (
      !firstName ||
      !lastName ||
      !email ||
      !dateOfBirth ||
      !phone ||
      !address ||
      !userType ||
      !password ||
      !confirmPassword
    ) {
      setError("Bitte alle Felder ausfüllen.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Die Passwörter stimmen nicht überein.");
      return;
    }

    sendRegisterRequest();
  };

  return (
      <Container className="d-flex justify-content-center align-items-center vh-100">
        <Row>
          <Col md={12}>
            <h1 className="text-center">Registrieren</h1>
            <Form onSubmit={handleSubmit} className="border p-4 rounded shadow">
              {error && <Alert variant="danger">{error}</Alert>}
              <Row>
                <Col>
                  <Form.Group controlId="formFirstName">
                    <Form.Label>Vorname*</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Vorname"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group controlId="formLastName">
                    <Form.Label>Nachname*</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Nachname"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col>
                  <Form.Group controlId="formEmail" className="mt-3">
                    <Form.Label>E-Mail*</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="E-Mail"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group controlId="formDateOfBirth" className="mt-3">
                    <Form.Label>Geburtsdatum*</Form.Label>
                    <Form.Control
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col>
                  <Form.Group controlId="formPhone" className="mt-3">
                    <Form.Label>Telefonnummer*</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Telefonnummer"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group controlId="formAddress" className="mt-3">
                    <Form.Label>Adresse*</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Adresse"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group controlId="formRole" className="mt-3">
                <Form.Label>Wer sind Sie?</Form.Label>
                <Form.Control
                  as="select"
                  name="role"
                  value={formData.userType}
                  onChange={(event) =>
                    setFormData({ ...formData, userType: event.target.value })
                  }
                  required
                >
                  <option value="">Bitte auswählen...</option>
                  <option value={UserType.Client}>Einlagerer</option>
                  <option value={UserType.StorageOwner}>Lagerhalter</option>
                  <option value={UserType.WorkshopOwner}>
                    Werkstattinhaber
                  </option>
                  <option value={UserType.SpareAccessoryDealer}>
                    Ersatzteilanbieter
                  </option>
                </Form.Control>
              </Form.Group>

              <Row>
                <Col>
                  <Form.Group controlId="formPassword" className="mt-3">
                    <Form.Label>Passwort*</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Passwort"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group controlId="formConfirmPassword" className="mt-3">
                    <Form.Label>Passwort erneut eingeben*</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Passwort bestätigen"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Button variant="primary" type="submit" className="w-100 mt-4">
                Registrieren
              </Button>
            </Form>
            <div className="text-center mt-3">
              <Link to="/" className="text-muted">
                Zurück zum Login
              </Link>
            </div>
          </Col>
        </Row>
      </Container>
  );
}
