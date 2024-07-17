import { Accordion, Container, Row, Col, Button, Card, Stack, Modal, Form } from "react-bootstrap";
import { I_Storage } from "../../../Interfaces";
import UtilModal from "../../../Utilities/UtilModal";
import { useState } from "react";
import { getLocalStorage } from "../../../Auth";
import { useNavigate } from "react-router-dom";

type Props = {
  storage: I_Storage;
};

export default function C_Storage({
  storage: {
    address,
    brandSpecialization,
    id,
    name,
    openingHours,
    storageConditions,
    services,
    parkingSpaces,
  },
}: Props) {

  const [showModal, setShowModal] = useState<boolean>(false);
  const [psID, setpsID] = useState<number>(-1);
  const navigate = useNavigate();

  const days: string[] = [
    "Montag: ",
    "Dienstag: ",
    "Mittwoch: ",
    "Donnerstag: ",
    "Freitag: ",
    "Samstag: ",
    "Sonn- und Feiertage: ",
  ];

  const handleRequest = async () => {
    if (psID === -1) return;
    try {
      const response = await fetch(`http://localhost:8080/api/offer/create/${id}/${psID}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + getLocalStorage()?.token,
          },
        }
      );

      if (response.ok) {
        navigate("/c/notifications")
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      <UtilModal 
        show={showModal} 
        handleClose={() => setShowModal(false)} 
        modalTitle="Parkplatz auswählen" 
      >
        {
          parkingSpaces?.length === 0 ? (
            <Row className="text-center">
              <p>Keine Parkplätze verfügbar</p>
            </Row>
          ) : (
            <Form.Control
                as="select"
                onChange={(event) => setpsID(event.target.value as unknown as number)}
              >
                <option value={-1}>Wähle einen Parkplatz aus</option>
                {
                  parkingSpaces?.map(p => <option value={p.id}>{p.category}</option>)
                }
               
              </Form.Control>
          )
          
        }
        <Modal.Footer>
          <Button variant="success" 
            onClick={handleRequest}
            disabled={parkingSpaces?.length === 0}
          >
            Angebot anfordern
          </Button>
          <Button variant="danger" 
            onClick={() => setShowModal(false)}>
            abbrechen
          </Button>
        </Modal.Footer>
      </UtilModal>

      <Accordion key={id}>
        <Accordion.Item eventKey={id.toString()}>
          <Accordion.Header>
            <Container fluid>
              <Row style={{ display: "flex", alignItems: "center" }}>
                <Col md={10}>
                  <h1 style={{ fontWeight: "bold" }}>{name}</h1>
                </Col>
              </Row>
            </Container>
          </Accordion.Header>
          <Accordion.Body>
            <Container fluid>
              <Row>
                <Col md={4}>
                  <p>
                    <span style={{ fontWeight: "bold" }}>Adresse:</span>{" "}
                    {address}
                  </p>
                </Col>
                <Col md={4}>
                  <p>
                    <span style={{ fontWeight: "bold" }}>
                      Markenspezialisierung:
                    </span>{" "}
                    {brandSpecialization}
                  </p>
                </Col>
                <Col md={4}>
                  <p>
                    <span style={{ fontWeight: "bold" }}>
                      Lagerbedingungen:
                    </span>{" "}
                    {storageConditions}
                  </p>
                </Col>
              </Row>
              <Row>
                <Col md={4}>
                  <span
                    style={{
                      textDecorationLine: "underline",
                      fontWeight: "bold",
                    }}
                  >
                    Öffnungszeiten
                  </span>{" "}
                  <Stack gap={2}>
                    {openingHours.map((openingHour, index) => (
                      <p>
                        <span style={{ fontWeight: "bold" }}>
                          {days[index]}
                        </span>
                        {openingHour}
                      </p>
                    ))}
                  </Stack>
                </Col>
                <Col md={4}>
                  <span
                    style={{
                      textDecorationLine: "underline",
                      fontWeight: "bold",
                    }}
                  >
                    Services
                  </span>{" "}
                  <Stack gap={4}>
                    {services.map((service, index) => (
                      <Card key={index}>
                        <Card.Header>
                          <Container fluid>
                            <Row>
                              <Col md={6}>{service.name}</Col>
                              <Col md={6}>{service.price}€</Col>
                            </Row>
                          </Container>
                        </Card.Header>
                        <Card.Body>{service.description}</Card.Body>
                      </Card>
                    ))}
                  </Stack>
                </Col>
                <Col md={4}>
                  <span
                    style={{
                      textDecorationLine: "underline",
                      fontWeight: "bold",
                    }}
                  >
                    Stellplätze
                  </span>{" "}
                  <Stack gap={4}>
                    {parkingSpaces.map((parkingspace, index) => (
                      <Card key={index}>
                        <Card.Header>
                          <Container fluid>
                            <Row>
                              <Col md={12}>{parkingspace.category}</Col>
                            </Row>
                          </Container>
                        </Card.Header>
                        <Card.Body>{parkingspace.conditions}</Card.Body>
                      </Card>
                    ))}
                  </Stack>
                </Col>
              </Row>
              <Row>
                <Col 
                  md={12}
                  className="text-end"
                >
                    <Button
                      variant="success"
                      onClick={() => setShowModal(true)}
                    >
                      Angebot anfordern
                    </Button>
                </Col>
              </Row>
            </Container>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </>
  );
}
