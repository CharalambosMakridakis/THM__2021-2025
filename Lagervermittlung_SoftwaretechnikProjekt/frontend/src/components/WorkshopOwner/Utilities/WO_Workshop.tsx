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
import { I_Workshop } from "../../../Interfaces";
import { getLocalStorage } from "../../../Auth";
import { useState } from "react";
import UtilModal from "../../../Utilities/UtilModal";

type Props = {
  workshop: I_Workshop;
  fetchWorkshop: () => void;
};

export default function WO_Workshop({
  workshop: { address, brandSpecialization, id, openingHours, work },
  fetchWorkshop,
}: Props) {
  const [show, setShow] = useState<boolean>(false);
  const [show2, setShow2] = useState<boolean>(false);
  const [isForEditWork, setIsForEditWork] = useState<boolean>(false);

  const [designation, setDesignation] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [price, setPrice] = useState<number>(0);
  const [wId, setWId] = useState<number>(0);

  const [newAddress, setNewAddress] = useState<string>("");
  const [newBrandSpecialization, setNewBrandSpecialization] =
    useState<string>("");

  const [newMonday, setNewMonday] = useState<string>("");
  const [newTuesday, setNewTuesday] = useState<string>("");
  const [newWednesday, setNewWednesday] = useState<string>("");
  const [newThursday, setNewThursday] = useState<string>("");
  const [newFriday, setNewFriday] = useState<string>("");
  const [newSaturday, setNewSaturday] = useState<string>("");
  const [newSunday, setNewSunday] = useState<string>("");

  const days: string[] = [
    "Montag: ",
    "Dienstag: ",
    "Mittwoch: ",
    "Donnerstag: ",
    "Freitag: ",
    "Samstag: ",
    "Sonn- und Feiertage: ",
  ];

  const handleClose = () => {
    setShow(false);
    setNewAddress("");
    setNewBrandSpecialization("");
    setNewMonday("");
    setNewTuesday("");
    setNewWednesday("");
    setNewThursday("");
    setNewFriday("");
    setNewSaturday("");
    setNewSunday("");
  };

  const handleClose2 = () => {
    setShow2(false);
    setDesignation("");
    setDescription("");
    setPrice(0);
    setIsForEditWork(false);
  };

  const editWorkshop = () => {
    setNewAddress(address);
    setNewBrandSpecialization(brandSpecialization);
    setNewMonday(openingHours[0]);
    setNewTuesday(openingHours[1]);
    setNewWednesday(openingHours[2]);
    setNewThursday(openingHours[3]);
    setNewFriday(openingHours[4]);
    setNewSaturday(openingHours[5]);
    setNewSunday(openingHours[6]);
    setShow(true);
  };

  const handleUpdateWorkshopRequest = async () => {
    if (
      newAddress === "" ||
      newBrandSpecialization === "" ||
      newMonday === "" ||
      newTuesday === "" ||
      newWednesday === "" ||
      newThursday === "" ||
      newFriday === "" ||
      newSaturday === "" ||
      newSunday === ""
    ) {
      return;
    }

    const openingHours: string[] = [
      newMonday,
      newTuesday,
      newWednesday,
      newThursday,
      newFriday,
      newSaturday,
      newSunday,
    ];

    try {
      const response = await fetch(
        "http://localhost:8080/api/workshops/update",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + getLocalStorage()?.token,
          },
          body: JSON.stringify({
            id,
            address: newAddress,
            brandSpecialization: newBrandSpecialization,
            openingHours: openingHours,
          }),
        }
      );
      if (response.ok) {
        handleClose();
        fetchWorkshop();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddWorkRequest = async () => {
    if (designation === "" || description === "" || price === 0) {
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/work/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + getLocalStorage()?.token,
        },
        body: JSON.stringify({
          designation,
          description,
          price,
        }),
      });
      if (response.ok) {
        handleClose2();
        fetchWorkshop();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteWorkshopRequest = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/workshops/delete/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + getLocalStorage()?.token,
          },
        }
      );
      if (response.ok) {
        fetchWorkshop();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const editWork = async (workId: number) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/work/${workId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + getLocalStorage()?.token,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setDescription(data.description);
        setDesignation(data.designation);
        setPrice(data.price);
        setWId(workId);
        setIsForEditWork(true);
        setShow2(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditWorkRequest = async () => {
    if (designation === "" || description === "" || price === 0) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8080/api/work/update`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + getLocalStorage()?.token,
          },
          body: JSON.stringify({
            designation,
            description,
            price,
            id: wId,
          }),
        }
      );
      if (response.ok) {
        handleClose2();
        fetchWorkshop();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteWorkRequest = async (workId: number) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/work/delete/${workId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + getLocalStorage()?.token,
          },
        }
      );
      if (response.ok) {
        fetchWorkshop();
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
        modalTitle="Werkstatt Editieren"
      >
        <Modal.Body>
          <Container fluid>
            <Row>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Adresse</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Wiesenstraße 14, 35390 Gießen"
                    onChange={(event) => setNewAddress(event.target.value)}
                    value={newAddress}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Markenspezialisierung</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Volkswagen"
                    onChange={(event) =>
                      setNewBrandSpecialization(event.target.value)
                    }
                    value={newBrandSpecialization}
                  />
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
                      value={newMonday}
                      onChange={(event) => setNewMonday(event.target.value)}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Dienstag</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="08:00 - 17:00 Uhr"
                      value={newTuesday}
                      onChange={(event) => setNewTuesday(event.target.value)}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Mittwoch</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="08:00 - 17:00 Uhr"
                      value={newWednesday}
                      onChange={(event) => setNewWednesday(event.target.value)}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Donnerstag</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="08:00 - 17:00 Uhr"
                      value={newThursday}
                      onChange={(event) => setNewThursday(event.target.value)}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Freitag</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="08:00 - 17:00 Uhr"
                      value={newFriday}
                      onChange={(event) => setNewFriday(event.target.value)}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Samstag</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="11:00 - 14:00 Uhr"
                      value={newSaturday}
                      onChange={(event) => setNewSaturday(event.target.value)}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Sonn- und Feiertage</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Geschlossen"
                      value={newSunday}
                      onChange={(event) => setNewSunday(event.target.value)}
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
          <Button variant="success" onClick={handleUpdateWorkshopRequest}>
            Editieren
          </Button>
        </Modal.Footer>
      </UtilModal>

      <UtilModal
        handleClose={handleClose2}
        show={show2}
        modalTitle={isForEditWork ? "Arbeit Editieren" : "Arbeit Hinzufügen"}
      >
        <Modal.Body>
          <Container fluid>
            <Row>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Bezeichnung</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Ölwechsel"
                    value={designation}
                    onChange={(event) => setDesignation(event.target.value)}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Preis in Euro</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="100"
                    value={price}
                    onChange={(event) =>
                      setPrice(event.target.value as unknown as number)
                    }
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Beschreibung</Form.Label>
                  <Form.Control
                    as="textarea"
                    placeholder="Vollständiger Ölwechsel mit Filterwechsel."
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Container>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleClose2}>
            Schließen
          </Button>
          {isForEditWork ? (
            <Button variant="success" onClick={handleEditWorkRequest}>
              Editieren
            </Button>
          ) : (
            <Button variant="success" onClick={handleAddWorkRequest}>
              Hinzufügen
            </Button>
          )}
        </Modal.Footer>
      </UtilModal>

      <Accordion key={id}>
        <Accordion.Item eventKey={id.toString()}>
          <Accordion.Header>
            <Container fluid>
              <Row style={{ display: "flex", alignItems: "center" }}>
                <Col md={10}>
                  <h1 style={{ fontWeight: "bold" }}>Deine Werkstatt</h1>
                </Col>
              </Row>
            </Container>
          </Accordion.Header>
          <Accordion.Body>
            <Container fluid>
              <Row>
                <Col md={6}>
                  <p>
                    <span style={{ fontWeight: "bold" }}>Adresse:</span>{" "}
                    {address}
                  </p>
                </Col>
                <Col md={6}>
                  <p>
                    <span style={{ fontWeight: "bold" }}>
                      Markenspezialisierung:
                    </span>{" "}
                    {brandSpecialization}
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
                      <p key={index}>
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
                    Arbeiten
                  </span>{" "}
                  <Stack gap={4}>
                    {work.map((oneWork, index) => (
                      <Card key={index}>
                        <Card.Header>
                          <Container fluid>
                            <Row>
                              <Col md={4}>{oneWork.designation}</Col>
                              <Col md={2}>{oneWork.price}€</Col>
                              <Col md={3} className="text-end">
                                <Button variant="primary" onClick={() => editWork(oneWork.id)}>Editieren</Button>
                              </Col>
                              <Col md={3} className="text-end">
                                <Button variant="danger" onClick={() => handleDeleteWorkRequest(oneWork.id)}>Löschen</Button>
                              </Col>
                            </Row>
                          </Container>
                        </Card.Header>
                        <Card.Body>{oneWork.description}</Card.Body>
                      </Card>
                    ))}
                  </Stack>
                </Col>
              </Row>
              <Row style={{ marginTop: 10 }}>
                <Col md={4}>
                  <Button onClick={editWorkshop}>Werkstatt Editieren</Button>
                </Col>
                <Col md={4}>
                  <Button variant="primary" onClick={() => setShow2(true)}>
                    Arbeit hinzufügen
                  </Button>
                </Col>
                <Col md={4} className="text-end">
                  <Button
                    variant="danger"
                    onClick={handleDeleteWorkshopRequest}
                  >
                    Werkstatt löschen
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
