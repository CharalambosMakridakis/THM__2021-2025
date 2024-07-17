import { useEffect, useState } from "react";
import UtilCard from "../../Utilities/UtilCard";
import { Badge, Button, Card, Col, Container, Form, Modal, Row, Stack } from "react-bootstrap";
import { WO_DateNegotiation, WO_WorkshopRequest } from "../../Interfaces";
import { getLocalStorage } from "../../Auth";
import UtilModal from "../../Utilities/UtilModal";

export default function WO_NotificationsComponent() {
  const [notifications, setNotifications] = useState<WO_WorkshopRequest[]>([]);
  const [DNs, setDNs] = useState<WO_DateNegotiation[]>([]);
  const [show, setShow] = useState<boolean>(false);
  const [date, setDate] = useState<string>("");
  const [currentDnID, setCurrentDnID] = useState<number>(-1);

  const getCarNameID = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:8080/api/car/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + getLocalStorage()?.token,
        },
      });
      const car: {
        id: number, 
        model: string, 
        productionYear: string, 
        brand: string, 
        numberPlate: string,
        chassisNumber: string,
        maintenanceRecord: string,
        driveability: string,
        services: []
      } = await response.json();
      return car;
    } catch (error) {
      return null;
    }
  }

  const getWorkByID = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:8080/api/work/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + getLocalStorage()?.token,
        },
      });
      const work: {id: number, designation: string, price: string, description: string } = await response.json();
      return work;
    } catch (error) {
      return null;
    }
  }

  const fetchNotifications = () => {
    try {
      const fetchWorkschopRequests = async () => {
        const response = await fetch("http://localhost:8080/api/workshopRequest/my", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + getLocalStorage()?.token,
          },
        });
        const notis: WO_WorkshopRequest[] = await response.json();
        setNotifications(notis);
      };
      fetchWorkschopRequests();

      const fetchDNs = async () => {
        const response = await fetch("http://localhost:8080/api/datenegotiation/my", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + getLocalStorage()?.token,
          },
        });
        const dns: WO_DateNegotiation[] = await response.json();
        console.log(dns);
        setDNs(dns);
      };
      fetchDNs();
    } catch (e) {
      return;
    }
  }

  useEffect(() => {
    fetchNotifications()
  }, []);

  const handleAcceptWorkshopRequest = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:8080/api/workshopRequest/eval/${id}/true`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + getLocalStorage()?.token,
          },
        }
      );

      if (response.ok) {
        fetchNotifications();
      }
    } catch (error) {
      console.error(error);
    }
  }

  const handleDismissWorkshopRequest = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:8080/api/workshopRequest/eval/${id}/false`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + getLocalStorage()?.token,
          },
        }
      );

      if (response.ok) {
        fetchNotifications();
      }
    } catch (error) {
      console.error(error);
    }
  }

  const handleDnDismiss = async () => {
    setShow(false);
    try {
      const response = await fetch(`http://localhost:8080/api/datenegotiation/eval/${currentDnID}/false`,
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


  const handleDnAccept = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:8080/api/datenegotiation/eval/${id}/true`,
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
          <p>Wähle ein Datum</p>
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
          <Button variant="success" onClick={handleDnDismiss}>
            Datum senden
          </Button>
        </Modal.Footer>
      </UtilModal>


      {(notifications && notifications.length > 0) && <h1>Anfrage</h1>}
      <Stack gap={4}>
        {notifications.map((notification) => {
          let doneMessage = <p></p>;
          if (notification.status === "accept/dismiss") doneMessage = (<Row>
            <Col className="text-end">
              <Button onClick={() => handleAcceptWorkshopRequest(notification.id)} variant="success">annehmen</Button>
            </Col>
            <Col className="text-end">
              <Button onClick={() => handleDismissWorkshopRequest(notification.id)} variant="danger">ablehnen</Button>
            </Col>
          </Row>);
          else if (notification.status === "done-accepted") doneMessage = <Badge bg="success">erfolgreich abgeschlossen</Badge>;
          else if (notification.status === "done-dismissed") doneMessage = <Badge bg="danger">abgebrochen</Badge>;
          else if (notification.status === "done-date") doneMessage = <Badge bg="success">Datum ausmachen</Badge>;

          const lastHistoryItem = notification.history.length > 0 ? notification.history[notification.history.length - 1] : '';

          return (
            <UtilCard key={notification.id} cardHeader={"Werkstattanfrage"}>
              <Container fluid>
                <Row>
                  <Col md={6}>
                    <Card.Text>{lastHistoryItem}</Card.Text>
                    <Card.Text>KFZ: {notification.car.brand} {notification.car.model}</Card.Text>
                    <Card.Text>Kennzeichen: {notification.car.numberPlate}</Card.Text>
                    <Card.Text>Arbeit: {notification.work.designation}</Card.Text>
                  </Col>
                  <Col md={3}>
                  </Col>
                  <Col md={3}>
                  </Col>
                  <Col md={6}/>
                  <Col md={6} className="text-end">
                    {doneMessage}
                  </Col>
                </Row>
              </Container>
            </UtilCard>
          );
        })}
      </Stack>

      {(DNs && DNs.length > 0) && <h1>Terminverhandlungen</h1>}
      <Stack gap={4}>
        {DNs.map((notification) => {
          let doneMessage = <p></p>;
          if (notification.status === "accept/dismiss-wo") doneMessage = (<Row>
            <Col>
              <Button onClick={() => handleDnAccept(notification.id)} variant="success">annehmen</Button>
            </Col>
            <Col>
              <Button onClick={() => {
                setCurrentDnID(notification.id);
                setShow(true);
              }} variant="danger">ablehnen</Button>
            </Col>
          </Row>);
          else if (notification.status === "done-accepted") doneMessage = <Badge bg="success">erfolgreich abgeschlossen</Badge>;
          else if (notification.status === "done-dismissed") doneMessage = <Badge bg="danger">abgebrochen</Badge>;
          else if (notification.status === "done-date") doneMessage = <Badge bg="success">Datum ausmachen</Badge>;

          const lastHistoryItem = notification.history.length > 0 ? notification.history[notification.history.length - 1] : '';

          return (
            <UtilCard key={notification.id} cardHeader={"Terminverhandlung für Werkstattarbeiten"}>
              <Container fluid>
                <Row>
                  <Col md={6}>
                    <Card.Text>{lastHistoryItem}</Card.Text>
                  </Col>
                  <Col md={3}>
                  </Col>
                  <Col md={3}>
                  </Col>
                  <Col md={6}/>
                  <Col md={6} className="text-end">
                    {doneMessage}
                  </Col>
                </Row>
              </Container>
            </UtilCard>
          );
        })}
      </Stack>
    </>
  );
}
