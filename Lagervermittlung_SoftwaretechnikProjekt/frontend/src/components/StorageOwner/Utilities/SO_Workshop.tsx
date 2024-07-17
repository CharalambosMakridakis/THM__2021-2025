import {
  Accordion,
  Button,
  Card,
  Col,
  Container,
  Form,
  Modal,
  Row,
  Stack,
} from "react-bootstrap";
import { I_Car, I_Work, I_Workshop } from "../../../Interfaces";
import UtilModal from "../../../Utilities/UtilModal";
import { useState } from "react";
import { getLocalStorage } from "../../../Auth";

type Props = {
  workshop: I_Workshop;
};

export default function SO_Workshop({
  workshop: { address, brandSpecialization, id, openingHours, work },
}: Props) {
  const [show, setShow] = useState(false);
  const [worksFromWorkshop, setWorksFromWorkshop] = useState<I_Work[]>([]);
  const [cars, setCars] = useState<I_Car[]>([]);
  const [selectedWork, setSelectedWork] = useState<number>(0);
  const [selectedCar, setSelectedCar] = useState<number>(0);

  const handleClose = () => {
    setShow(false);
    setWorksFromWorkshop([]);
    setCars([]);
    setSelectedWork(0);
    setSelectedCar(0);
  };

  const workRequest = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/workshops/${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + getLocalStorage()?.token,
          },
        }
      );
      if (response.ok) {
        const secondResponse = await fetch(
          `http://localhost:8080/api/car/myCars`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + getLocalStorage()?.token,
            },
          }
        );
        if (secondResponse.ok) {
          const secondData: I_Car[] = await secondResponse.json();
          setCars(secondData);
          const data: I_Workshop = await response.json();
          setWorksFromWorkshop(data.work);
          setShow(true);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleWorkRequest = async () => {
    if (selectedWork === 0 || selectedCar === 0) {
      return;
    }
    try {
      const response = await fetch(
        `http://localhost:8080/api/workshopRequest/create/${selectedCar}/${selectedWork}/${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + getLocalStorage()?.token,
          },
        }
      );
      if (response.ok) {
        handleClose();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const days: string[] = [
    "Montag: ",
    "Dienstag: ",
    "Mittwoch: ",
    "Donnerstag: ",
    "Freitag: ",
    "Samstag: ",
    "Sonn- und Feiertage: ",
  ];

  return (
    <>
      <UtilModal
        handleClose={handleClose}
        show={show}
        modalTitle="Service Anfragen"
      >
        <Modal.Body>
          <Container fluid>
            <Row>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Arbeit</Form.Label>
                  <Form.Control as="select" onChange={(event) => setSelectedWork(event.target.value as unknown as number)}>
                    <option value={0}>Arbeit auswählen</option>
                    {worksFromWorkshop.map((work, index) => (
                      <option key={index} value={work.id}>
                        {work.designation}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Fahrzeug</Form.Label>
                  <Form.Control as="select" onChange={(event) => setSelectedCar(event.target.value as unknown as number)}>
                    <option value={0}>Fahrzeug auswählen</option>
                    {cars.map((car, index) => (
                      <option key={index} value={car.id}>
                        {car.brand} {car.model} {car.numberPlate}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </Col>
            </Row>
          </Container>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleClose}>
            Schließen
          </Button>
          <Button variant="success" onClick={handleWorkRequest}>
            Anfragen
          </Button>
        </Modal.Footer>
      </UtilModal>
      <Accordion key={id}>
        <Accordion.Item eventKey={id.toString()}>
          <Accordion.Header>
            <Container fluid>
              <Row style={{ display: "flex", alignItems: "center" }}>
                <Col md={12}>
                  <h1 style={{ fontWeight: "bold" }}>Werkstatt in {address}</h1>
                </Col>
              </Row>
            </Container>
          </Accordion.Header>
          <Accordion.Body>
            <Container fluid>
              <Row>
                <Col md={6}>
                  <span style={{ fontWeight: "bold" }}>
                    Markenspezialisierung:
                  </span>{" "}
                  {brandSpecialization ? brandSpecialization : "Keine"}
                </Col>
                <Col md={6}></Col>
              </Row>
              <Row>
                <Col md={6}>
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
                      <p key={index}>
                        <span style={{ fontWeight: "bold" }}>
                          {days[index]}
                        </span>
                        {openingHour}
                      </p>
                    ))}
                  </Stack>
                </Col>
                <Col md={6}>
                  <span
                    style={{
                      textDecorationLine: "underline",
                      fontWeight: "bold",
                    }}
                  >
                    Arbeiten
                  </span>{" "}
                  <Stack gap={2}>
                    {work.map((work, index) => (
                      <Card key={index}>
                        <Card.Header>
                          <Container fluid>
                            <Row>
                              <Col md={6}>{work.designation}</Col>
                              <Col md={6}>{work.price} €</Col>
                            </Row>
                          </Container>
                        </Card.Header>
                        <Card.Body>{work.description}</Card.Body>
                      </Card>
                    ))}
                  </Stack>
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <Button
                    variant="success"
                    onClick={workRequest}
                    style={{ marginTop: "10px" }}
                    className="float-end"
                  >
                    Service anfragen
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
