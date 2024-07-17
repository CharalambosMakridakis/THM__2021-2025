import { useState } from "react";
import {
  Accordion,
  Badge,
  Button,
  Col,
  Container,
  Form,
  Modal,
  Row,
} from "react-bootstrap";
import UtilModal from "../../../Utilities/UtilModal";
import C_Services from "./C_Services";
import { I_Car } from "../../../Interfaces";
import { getLocalStorage } from "../../../Auth";

type Props = {
  car: I_Car;
  bookService: (carId: number, serviceId: number) => void;
};

function C_Car({
  car: {
    id,
    model,
    productionYear,
    brand,
    numberPlate,
    chassisNumber,
    maintenanceRecord,
    driveability,
    serviceEntities
  },
  bookService,
}: Props) {
  const [show, setShow] = useState<boolean>(false);
  const [show2, setShow2] = useState<boolean>(false);
  const [selectedService, setSelectedService] = useState<number>(0);
  const [date, setDate] =  useState<string>("");

  const handleClose = () => {
    setShow(false);
    setShow2(false);
  };

  const handleBook = () => {
    if (selectedService === 0) return;
    bookService(id, selectedService);
    setSelectedService(0);
    setShow(false);
  };

  const handleAppointment = async () => {

    if(date === "") return;
    if(!id) return;

    try {
      const response = await fetch(`http://localhost:8080/api/rrn/create/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + getLocalStorage()?.token,
        },
        body: JSON.stringify(date)
      });
  
      if(response.ok) {
        handleClose();
      }
    } catch (error) {
      console.log(error);
      return;
    }
  };

  return (
    <>
      <UtilModal
        handleClose={handleClose}
        show={show}
        modalTitle="Service Buchen"
      >
        <Modal.Body>
          <C_Services setSelectedService={setSelectedService} carId={id} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleClose}>
            Schließen
          </Button>
          <Button variant="success" onClick={handleBook}>
            Buchen
          </Button>
        </Modal.Footer>
      </UtilModal>

      <UtilModal
        handleClose={handleClose}
        show={show2}
        modalTitle="Entgegennahme/Rückgabe vereinbaren"
      >
        <Modal.Body>
          <p>Wähle ein Datum für die Entgegenahme/Rückgabe:</p>
          <Form.Group controlId="formDateOfBirth" className="mt-3">
                  <Form.Label>Datum</Form.Label>
                  <Form.Control
                    type="date"
                    name="dateOfBirth"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                  />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleClose}>
            Schließen
          </Button>
          <Button variant="success" onClick={handleAppointment}>
            Datum senden
          </Button>
        </Modal.Footer>
      </UtilModal>

      <Accordion key={id}>
        <Accordion.Item eventKey={id.toString()}>
          <Accordion.Header>
            <Container fluid>
              <Row style={{ display: "flex", alignItems: "center" }}>
                <Col md={10}>
                  <h1 style={{ fontWeight: "bold" }}>
                    {brand} {model}
                  </h1>
                </Col>
                <Col md={2}>
                  {driveability === "fahrbereit" ? (
                    <Badge bg="success" style={{ fontSize: "1.5rem" }}>
                      Fahrbereit
                    </Badge>
                  ) : (
                    <Badge bg="danger" style={{ fontSize: "1.3rem" }}>
                      Nicht Fahrbereit
                    </Badge>
                  )}
                </Col>
              </Row>
            </Container>
          </Accordion.Header>
          <Accordion.Body>
            <Container fluid>
              <Row>
                <Col md={6}>
                  <p>
                    <span style={{ fontWeight: "bold" }}>Kennzeichen:</span>{" "}
                    {numberPlate}
                  </p>
                  <p>
                    <span style={{ fontWeight: "bold" }}>Baujahr:</span>{" "}
                    {productionYear}
                  </p>
                </Col>
                <Col md={6}>
                  <p>
                    <span style={{ fontWeight: "bold" }}>
                      Fahrgestellnummer:
                    </span>{" "}
                    {chassisNumber}
                  </p>
                  <p>
                    <span style={{ fontWeight: "bold" }}>Warungsstand:</span>{" "}
                    {maintenanceRecord}
                  </p>
                  <p>
                    <span style={{ fontWeight: "bold" }}>Services:</span>{" "}
                    {serviceEntities && serviceEntities?.map(x => x.name).join(", ")}
                  </p>
                </Col>
              </Row>
              <Row>
                <Col md={10} className="text-end">
                  <Button variant="primary" onClick={() => setShow2(true)}>
                    Entgegennahme/Rückgabe vereinbaren
                  </Button>
                </Col>
                <Col md={2} className="text-end">
                  <Button variant="primary" onClick={() => setShow(true)}>
                    Service Buchen
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

export default C_Car;
