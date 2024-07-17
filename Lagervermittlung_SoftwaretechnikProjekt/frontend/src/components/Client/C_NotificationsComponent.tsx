import { useEffect, useState } from "react";
import UtilCard from "../../Utilities/UtilCard";
import { Badge, Button, Card, Col, Container, Form, Modal, Row, Stack } from "react-bootstrap";
import { I_Notification } from "../../Interfaces";
import { getLocalStorage } from "../../Auth";
import UtilModal from "../../Utilities/UtilModal";

export default function C_NotificationsComponent() {
  const [offers, setOffers] = useState<I_Notification[]>([]);
  const [RRNs, setRRNs] = useState<I_Notification[]>([]);
  const [show, setShow] = useState<boolean>(false);
  const [date, setDate] = useState<string>("");
  const [currentRRNId, setCurrentRRNId] = useState<number>(-1);


  const fetchNotifications = () => {
    try {
      const fetchOffers = async () => {
        const response = await fetch("http://localhost:8080/api/offer/my", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + getLocalStorage()?.token,
          },
        });
        const notis: I_Notification[] = await response.json();

        setOffers(notis);
      };
      fetchOffers();

      const fetchRRNs = async () => {
        const response = await fetch("http://localhost:8080/api/rrn/my", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + getLocalStorage()?.token,
          },
        });

        const notis: I_Notification[] = await response.json();
        console.log(notis);
        
        setRRNs(notis);
      };
      fetchRRNs();

    } catch (error) {
      return;
    }

  }

  useEffect(() => {
    fetchNotifications()
  }, []);

  const handleRRNDismiss = async () => {
    setShow(false);
    try {
      const response = await fetch(`http://localhost:8080/api/rrn/eval/${currentRRNId}/false`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + getLocalStorage()?.token,
          },
          body: JSON.stringify(date ? date : "")
        }
      );

      if (response.ok) {
        fetchNotifications();
      }
    } catch (error) {
      console.error(error);
    }
  }

  const handleRRNAccept = async (rrnId: number) => {
    try {
      const response = await fetch(`http://localhost:8080/api/rrn/eval/${rrnId}/true`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + getLocalStorage()?.token,
          },
          body: JSON.stringify(date ? date : "")
        }
      );

      if (response.ok) {
        fetchNotifications();
      }
    } catch (error) {
      console.error(error);
    }
  }


  return (
    <>
      <UtilModal
        handleClose={() => setShow(false)}
        show={show}
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
          <Button variant="danger" onClick={() => setShow(false)}>
            Schließen
          </Button>
          <Button variant="success" onClick={handleRRNDismiss}>
            Datum senden
          </Button>
        </Modal.Footer>
      </UtilModal>

      {
        (offers && offers.length > 0) &&
        <h1>Angebote:</h1>
      }
      <Stack gap={4}>
        {offers.map((notification) => {
          let doneMessage = <p></p>;
          if (notification.status === "accept/dismiss") doneMessage = <Badge bg="success">aktiv</Badge>;
          else if (notification.status === "done-accepted") doneMessage = <Badge bg="success">erfolgreich abgeschlossen</Badge>;
          else if (notification.status === "done-dismissed") doneMessage = <Badge bg="danger">abgebrochen</Badge>;
          else if (notification.status === "done-date") doneMessage = <Badge bg="success">Datum ausmachen</Badge>;

          const lastHistoryItem = notification.history.length > 0 ? notification.history[notification.history.length - 1] : '';

          return (
            <UtilCard key={notification.id} cardHeader={"Angebot"}>
              <Container fluid>
                <Row>
                  <Col md={6}>
                    <Card.Text>{lastHistoryItem}</Card.Text>
                    <Card.Text>{notification.parkingSpace.category}</Card.Text>
                    <Card.Text>{notification.parkingSpace.conditions}</Card.Text>
                  </Col>
                  <Col md={6} className="text-end">
                    <Card.Text>{doneMessage}</Card.Text>
                  </Col>
                </Row>
              </Container>
            </UtilCard>
          )
        })}
      </Stack>

      {
        (RRNs && RRNs.length > 0) &&
        <h1>Entgegennahme/Rückgabe</h1>
      }
      <Stack gap={4}>
        {RRNs.map((notification) => {
          let doneMessage = <p></p>;
          if (notification.status === "accept/dismiss-so") doneMessage = <Badge bg="success">aktiv</Badge>;
          if (notification.status === "accept/dismiss-cl") doneMessage = (<Row>
            <Col>
              <Button onClick={() => handleRRNAccept(notification.id)} variant="success">annehmen</Button>
            </Col>
            <Col>
              <Button onClick={() => {
                setCurrentRRNId(notification.id);
                setShow(true);
              }} variant="danger">ablehnen</Button>
            </Col>
          </Row>);
          else if (notification.status === "done-accepted") doneMessage = <Badge bg="success">erfolgreich abgeschlossen</Badge>;
          else if (notification.status === "done-dismissed") doneMessage = <Badge bg="danger">abgebrochen</Badge>;
          else if (notification.status === "done-date") doneMessage = <Badge bg="success">Datum ausmachen</Badge>;

          const lastHistoryItem = notification.history.length > 0 ? notification.history[notification.history.length - 1] : '';

          return (
            <UtilCard key={notification.id} cardHeader={"Entgegnnahme/Rückgabe"}>
              <Container fluid>
                <Row>
                  <Col md={6}>
                    <Card.Text>{lastHistoryItem}</Card.Text>
                    <Card.Text>KFZ: {notification.car.brand} {notification.car.model}</Card.Text>
                    <Card.Text>Kennzeichen: {notification.car.numberPlate}</Card.Text>
                  </Col>
                  <Col md={6} className="text-end">
                    {doneMessage}
                  </Col>
                </Row>
              </Container>
            </UtilCard>
          )
        })}
      </Stack>
    </>
  );
}
