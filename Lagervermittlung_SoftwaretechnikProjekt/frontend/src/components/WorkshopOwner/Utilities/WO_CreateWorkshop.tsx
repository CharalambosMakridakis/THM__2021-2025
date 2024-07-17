import { useState } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  Modal,
  Row,
} from "react-bootstrap";
import UtilModal from "../../../Utilities/UtilModal";
import { getLocalStorage } from "../../../Auth";

type Props = {
  fetchWorkshop: () => void;
};

export default function WO_CreateWorkshop({ fetchWorkshop }: Props) {
  const [show, setShow] = useState(false);

  const [address, setAddress] = useState<string>("");
  const [brandSpecialization, setBrandSpecialization] = useState<string>("");

  const [monday, setMonday] = useState<string>("");
  const [tuesday, setTuesday] = useState<string>("");
  const [wednesday, setWednesday] = useState<string>("");
  const [thursday, setThursday] = useState<string>("");
  const [friday, setFriday] = useState<string>("");
  const [saturday, setSaturday] = useState<string>("");
  const [sunday, setSunday] = useState<string>("");

  const handleClose = () => {
    setShow(false);
    setAddress("");
    setBrandSpecialization("");
    setMonday("");
    setTuesday("");
    setWednesday("");
    setThursday("");
    setFriday("");
    setSaturday("");
    setSunday("");
  };

  const createWorkshop = async () => {
    if (
      address === "" ||
      brandSpecialization === "" ||
      monday === "" ||
      tuesday === "" ||
      wednesday === "" ||
      thursday === "" ||
      friday === "" ||
      saturday === "" ||
      sunday === ""
    ) {
      return;
    }
    const openingHours: string[] = [
      monday,
      tuesday,
      wednesday,
      thursday,
      friday,
      saturday,
      sunday,
    ];

    try {
      const response = await fetch(
        "http://localhost:8080/api/workshops/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + getLocalStorage()?.token,
          },
          body: JSON.stringify({
            address,
            brandSpecialization,
            openingHours,
          }),
        }
      );
      if (response.ok) {
        fetchWorkshop();
        handleClose();
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <UtilModal
        handleClose={handleClose}
        show={show}
        modalTitle="Werkstatt hinzufügen"
      >
        <Modal.Body>
          <Container fluid>
            <Row>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Adresse</Form.Label>
                  <Form.Control type="text" placeholder="Wiesenstraße 14, 35390 Gießen" onChange={(event) => setAddress(event.target.value)} />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Markenspezialisierung</Form.Label>
                  <Form.Control type="text" placeholder="Volkswagen" onChange={(event) => setBrandSpecialization(event.target.value)}/>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Öffnungszeiten</Form.Label>
                  <Form.Group className="mb-3">
                    <Form.Label>Montag</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="08:00 - 17:00 Uhr"
                      value={monday}
                      onChange={(event) => setMonday(event.target.value)}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Dienstag</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="08:00 - 17:00 Uhr"
                      value={tuesday}
                      onChange={(event) => setTuesday(event.target.value)}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Mittwoch</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="08:00 - 17:00 Uhr"
                      value={wednesday}
                      onChange={(event) => setWednesday(event.target.value)}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Donnerstag</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="08:00 - 17:00 Uhr"
                      value={thursday}
                      onChange={(event) => setThursday(event.target.value)}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Freitag</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="08:00 - 17:00 Uhr"
                      value={friday}
                      onChange={(event) => setFriday(event.target.value)}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Samstag</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="11:00 - 14:00 Uhr"
                      value={saturday}
                      onChange={(event) => setSaturday(event.target.value)}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Sonn- und Feiertage</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Geschlossen"
                      value={sunday}
                      onChange={(event) => setSunday(event.target.value)}
                    />
                  </Form.Group>
                </Form.Group>
              </Col>
            </Row>
          </Container>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleClose}>
            Schließen
          </Button>
          <Button variant="success" onClick={createWorkshop}>
            Erstellen
          </Button>
        </Modal.Footer>
      </UtilModal>

      <Card
        body
        className="text-center"
        onClick={() => setShow(true)}
        role="button"
      >
        <h1>+</h1>
      </Card>
    </>
  );
}
