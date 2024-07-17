import { useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  Modal,
  Row,
  Accordion,
  Stack,
} from "react-bootstrap";
import UtilModal from "../../Utilities/UtilModal";
import { getLocalStorage } from "../../Auth";
import { I_SpareAccessoryPart } from "../../Interfaces";

export default function SAD_HomeComponent() {
  const [show, setShow] = useState<boolean>(false);
  const [showEdit, setShowEdit] = useState<boolean>(false);
  const [pId, setPId] = useState<number>(0);

  const [spareParts, setSpareParts] = useState<I_SpareAccessoryPart[]>([]);

  const [designation, setDesignation] = useState<string>("");
  const [articleNumber, setArticleNumber] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [model, setModel] = useState<string>("");
  const [brand, setBrand] = useState<string>("");

  const fetchSpareParts = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/SAP/my", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + getLocalStorage()?.token,
        },
      });
      if (response.ok) {
        const spareParts: I_SpareAccessoryPart[] = await response.json();
        setSpareParts(spareParts);
      }
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchSpareParts();
  }, []);

  const handleClose = () => {
    setShow(false);
    setShowEdit(false);
    setArticleNumber("");
    setBrand("");
    setDesignation("");
    setDescription("");
    setModel("");
    setPrice("");
  };

  const handlePartAdditionRequest = async () => {
    if (
      articleNumber === "" ||
      brand === "" ||
      designation === "" ||
      description === "" ||
      model === "" ||
      price === ""
    ) {
      return;
    }

    try {
      const reponse = await fetch("http://localhost:8080/api/SAP/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + getLocalStorage()?.token,
        },
        body: JSON.stringify({
          articleNumber,
          brand,
          designation,
          description,
          model,
          price,
        }),
      });
      if (reponse.ok) {
        handleClose();
        fetchSpareParts();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const editPart = async (partId: number) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/SAP/${partId}`,
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
        setModel(data.model);
        setBrand(data.brand);
        setArticleNumber(data.articleNumber);
        setPId(data.id);
        setShowEdit(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditPartRequest = async () => {
    if (
      articleNumber === "" ||
      brand === "" ||
      designation === "" ||
      description === "" ||
      model === "" ||
      price === ""
    ) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8080/api/SAP/update`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + getLocalStorage()?.token,
          },
          body: JSON.stringify({
            articleNumber,
            brand,
            designation,
            description,
            model,
            price,
            id: pId,
          }),
        }
      );
      if (response.ok) {
        handleClose();
        fetchSpareParts();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeletePartRequest = async (partId: number) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/SAP/delete/${partId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + getLocalStorage()?.token,
          },
        }
      );
      if (response.ok) {
        fetchSpareParts();
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
        modalTitle="Ersatzteil Hinzufügen"
      >
        <Modal.Body>
          <Container fluid>
            <Row>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Bezeichnung</Form.Label>
                  <Form.Control
                    type="text"
                    value={designation}
                    onChange={(event) => setDesignation(event.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Artikelnummer</Form.Label>
                  <Form.Control
                    type="text"
                    value={articleNumber}
                    onChange={(event) => setArticleNumber(event.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Preis</Form.Label>
                  <Form.Control
                    type="text"
                    value={price}
                    onChange={(event) => setPrice(event.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Modell</Form.Label>
                  <Form.Control
                    type="text"
                    value={model}
                    onChange={(event) => setModel(event.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Marke</Form.Label>
                  <Form.Control
                    type="text"
                    value={brand}
                    onChange={(event) => setBrand(event.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Beschreibung</Form.Label>
                  <Form.Control
                    as="textarea"
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Container>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleClose}>
            Schließen
          </Button>
          <Button variant="success" onClick={handlePartAdditionRequest}>
            Hinzufügen
          </Button>
        </Modal.Footer>
      </UtilModal>

      <UtilModal
        handleClose={handleClose}
        show={showEdit}
        modalTitle="Ersatzteil bearbeiten"
      >
        <Modal.Body>
          <Container fluid>
            <Row>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Bezeichnung</Form.Label>
                  <Form.Control
                    type="text"
                    value={designation}
                    onChange={(event) => setDesignation(event.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Artikelnummer</Form.Label>
                  <Form.Control
                    type="text"
                    value={articleNumber}
                    onChange={(event) => setArticleNumber(event.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Beschreibung</Form.Label>
                  <Form.Control
                    as="textarea"
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Preis</Form.Label>
                  <Form.Control
                    type="text"
                    value={price}
                    onChange={(event) => setPrice(event.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Modell</Form.Label>
                  <Form.Control
                    type="text"
                    value={model}
                    onChange={(event) => setModel(event.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Marke</Form.Label>
                  <Form.Control
                    type="text"
                    value={brand}
                    onChange={(event) => setBrand(event.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Container>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleClose}>
            Schließen
          </Button>
          <Button variant="success" onClick={handleEditPartRequest}>
            Speichern
          </Button>
        </Modal.Footer>
      </UtilModal>

      <Stack gap={2}>
        <Card
          body
          className="text-center"
          onClick={() => setShow(true)}
          role="button"
        >
          <h1>+</h1>
        </Card>
        {spareParts.map((part) => (
          <Accordion key={part.id}>
            <Accordion.Item eventKey={part.id.toString()}>
              <Accordion.Header>
                <Container fluid>
                  <Row style={{ display: "flex", alignItems: "center" }}>
                    <Col md={10}>
                      <h1 style={{ fontWeight: "bold" }}>{part.designation}</h1>
                    </Col>
                  </Row>
                </Container>
              </Accordion.Header>
              <Accordion.Body>
                <Container fluid>
                  <Row>
                    <Col md={4}>
                      <p>
                        <span style={{ fontWeight: "bold" }}>
                          Beschreibung:
                        </span>{" "}
                        {part.description}
                      </p>
                      <p>
                        <span style={{ fontWeight: "bold" }}>Kosten:</span>{" "}
                        {part.price} €
                      </p>
                    </Col>
                    <Col md={4}>
                      <p>
                        <span style={{ fontWeight: "bold" }}>
                          Artikelnummer:
                        </span>{" "}
                        {part.articleNumber}
                      </p>
                      <p>
                        <span style={{ fontWeight: "bold" }}>Marke:</span>{" "}
                        {part.brand}
                      </p>
                    </Col>
                    <Col md={4}>
                      <p>
                        <span style={{ fontWeight: "bold" }}>Modell:</span>{" "}
                        {part.model}
                      </p>
                    </Col>
                  </Row>
                  <Row style={{ marginTop: 10 }}>
                    <Col md={6}>
                      <Button onClick={() => editPart(part.id)}>
                        Ersatzteil bearbeiten
                      </Button>
                    </Col>
                    <Col md={6} className="text-end">
                      <Button
                        variant="danger"
                        onClick={() => handleDeletePartRequest(part.id)}
                      >
                        Ersatzteil löschen
                      </Button>
                    </Col>
                  </Row>
                </Container>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        ))}
      </Stack>
    </>
  );
}
