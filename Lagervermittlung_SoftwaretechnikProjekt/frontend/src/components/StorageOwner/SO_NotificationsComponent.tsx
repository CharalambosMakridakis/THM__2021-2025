import { useEffect, useState } from "react";
import { I_Notification, WO_DateNegotiation, WO_WorkshopRequest } from "../../Interfaces";
import { getLocalStorage } from "../../Auth";
import UtilModal from "../../Utilities/UtilModal";
import { Badge, Button, Card, Col, Container, Form, Modal, Row, Stack } from "react-bootstrap";
import UtilCard from "../../Utilities/UtilCard";

export default function SO_NotificationsComponent() {
  const [show, setShow] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<I_Notification[]>([]);
  const [RRNs, setRRNs] = useState<I_Notification[]>([]);
  const [woRequests, setWoRequests] = useState<WO_WorkshopRequest[]>([]);
  const [date, setDate] = useState<string>("");
  const [currentRRNId, setCurrentRRNId] = useState<number>(-1);
  const [forDDN, setForDDN] = useState<boolean>(true);
  const [idForDn, setIdForDn] = useState<number>(-1);
  const [DNs, setDNs] = useState<WO_DateNegotiation[]>([]);
  const [woRequestId, setWoRequestId] = useState<number>(-1);
  

  const fetchNotifications = async () => {
    const response = await fetch("http://localhost:8080/api/offer/my", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + getLocalStorage()?.token,
      },
    });
    const notis: I_Notification[] = await response.json();
    setNotifications(notis);

    const fetchRRNs = async () => {
      const response = await fetch("http://localhost:8080/api/rrn/my", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + getLocalStorage()?.token,
        },
      });
      const notis: I_Notification[] = await response.json();
      setRRNs(notis);
    };
    fetchRRNs();

    const fetchWOs = async () => {
      const response = await fetch("http://localhost:8080/api/workshopRequest/my", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + getLocalStorage()?.token,
        },
      });
      const wos: WO_WorkshopRequest[] = await response.json();
      setWoRequests(wos);
    };
    fetchWOs();

    const fetchDNs = async () => {
      const response = await fetch("http://localhost:8080/api/datenegotiation/my", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + getLocalStorage()?.token,
        },
      });
      const dns: WO_DateNegotiation[] = await response.json();
      setDNs(dns);
    };
    fetchDNs();
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleAccept = async (offerId: number) => {
    try {
      const response = await fetch(`http://localhost:8080/api/offer/eval/${offerId}/true`,
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

  const handleDismiss = async (offerId: number) => {
    try {
      const response = await fetch(`http://localhost:8080/api/offer/eval/${offerId}/false`,
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

  const handleCreateDN = async (workShopId: number) => {
    try {
      
      const response = await fetch(`http://localhost:8080/api/datenegotiation/create/${workShopId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + getLocalStorage()?.token,
          },
          body: JSON.stringify(date ? date : "")
        }
      );

      const res = await fetch(`http://localhost:8080/api/workshopRequest/setdone/${woRequestId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + getLocalStorage()?.token,
          },
        }
      );
      if(!res.ok) console.log(res);
      
      if (response.ok) {
        fetchNotifications();
        setShow(false);
      }
    } catch (error) {
      console.error(error);
    }
  }

  const handleDNDismiss = async (id: number) => {
    setShow(false);
    try {
      const response = await fetch(`http://localhost:8080/api/datenegotiation/eval/${id}/false`,
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

  const handleDNAccept = async (id: number) => {
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
          <Button variant="success" onClick={ () => {
            if(forDDN) handleRRNDismiss();
            else handleCreateDN(idForDn);
          }
          }>
            Datum senden
          </Button>
        </Modal.Footer>
      </UtilModal>

      {(notifications && notifications.length > 0) && <h1>Angebote</h1>}
      <Stack gap={4}>
        {notifications.map((notification) => {
          let doneMessage = <p></p>;
          if (notification.status === "accept/dismiss") doneMessage = (<Row>
            <Col>
              <Button onClick={() => handleAccept(notification.id)} variant="success">annehmen</Button>
            </Col>
            <Col>
              <Button onClick={() => handleDismiss(notification.id)} variant="danger">ablehnen</Button>
            </Col>
          </Row>);
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
                    {doneMessage}
                  </Col>
                </Row>
              </Container>
            </UtilCard>
          )
        })}
      </Stack>

      {(RRNs && RRNs.length > 0) && <h1>Entgegennahmen/Rückgaben</h1>}
      <Stack gap={4}>
        {RRNs.map((notification) => {
          let doneMessage = <p></p>;
          if (notification.status === "accept/dismiss-so") doneMessage = (<Row>
            <Col>
              <Button onClick={() => handleRRNAccept(notification.id)} variant="success">annehmen</Button>
            </Col>
            <Col>
              <Button onClick={() => {
                setCurrentRRNId(notification.id);
                setForDDN(true);
                setShow(true);
              }} variant="danger">ablehnen</Button>
            </Col>
          </Row>);
          else if (notification.status === "accept/dismiss-cl") doneMessage = <Badge bg="success">aktiv</Badge>;
          else if (notification.status === "done-accepted") doneMessage = <Badge bg="success">erfolgreich abgeschlossen</Badge>;
          else if (notification.status === "done-dismissed") doneMessage = <Badge bg="danger">abgebrochen</Badge>;
          else if (notification.status === "done-date") doneMessage = <Badge bg="success">Datum ausmachen</Badge>;

          const lastHistoryItem = notification.history.length > 0 ? notification.history[notification.history.length - 1] : '';
          
          return (
            <UtilCard key={notification.id} cardHeader={"Entgegennahme/Rückgabe"}>
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

      {(woRequests && woRequests.length > 0) && <h1>Werkstatt-Anfragen</h1>}
      <Stack gap={4}>
        {woRequests.map((notification) => {
          let doneMessage = <p></p>;
          if (notification.status === "accept/dismiss") doneMessage = <Badge bg="success">aktiv</Badge>;
          else if (notification.status === "done-accepted") doneMessage = <Badge bg="success">erfolgreich abgeschlossen</Badge>;
          else if (notification.status === "done-dismissed") doneMessage = <Badge bg="danger">abgebrochen</Badge>;
          else if (notification.status === "done-date") doneMessage = (
            <Button variant="success" onClick={() => {
              setForDDN(false);
              setIdForDn(notification.work.id);
              setWoRequestId(notification.id);
              setShow(true);
            }}>
              Datum ausmachen
            </Button>
          );

          const lastHistoryItem = notification.history.length > 0 ? notification.history[notification.history.length - 1] : '';

          return (
            <UtilCard key={notification.id} cardHeader={"Werkstatt-Anfrage"}>
              <Container fluid>
                <Row>
                  <Col md={6}>
                    <Card.Text>{lastHistoryItem}</Card.Text>
                    <Card.Text>KFZ: {notification.car.brand} {notification.car.model}</Card.Text>
                    <Card.Text>Kennzeichen: {notification.car.numberPlate}</Card.Text>
                    <Card.Text>Arbeit: {notification.work.designation}</Card.Text>
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

      {(DNs && DNs.length > 0) && <h1>Terminverhandlungen</h1>}
      <Stack gap={4}>
        {DNs.map((notification) => {
          let doneMessage = <p></p>;
          if (notification.status === "accept/dismiss-so") doneMessage = (<Row>
            <Col>
              <Button onClick={() => handleDNAccept(notification.id)} variant="success">annehmen</Button>
            </Col>
            <Col>
              <Button onClick={() => handleDNDismiss(notification.id)} variant="danger">ablehnen</Button>
            </Col>
          </Row>);
          else if (notification.status === "accept/dismiss-wo") doneMessage = <Badge bg="success">aktive</Badge>;
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