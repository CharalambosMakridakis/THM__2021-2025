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
import { I_Car } from "../../../Interfaces";
import { useState } from "react";
import UtilModal from "../../../Utilities/UtilModal";
import { getLocalStorage } from "../../../Auth";

type Props = {
  fetchCars: () => void;
  car: I_Car;
};

export default function SO_Car({
  fetchCars,
  car: {
    brand,
    chassisNumber,
    driveability,
    id,
    maintenanceRecord,
    model,
    numberPlate,
    productionYear,
    serviceEntities
  },
}: Props) {
  const [show, setShow] = useState(false);

  const [carBrand, setCarBrand] = useState<string>("");
  const [carChassisNumber, setCarChassisNumber] = useState<string>("");
  const [carDriveability, setCarDriveability] = useState<string>("");
  const [carId, setCarId] = useState<number>(0);
  const [carMaintenanceRecord, setCarMaintenanceRecord] = useState<string>("");
  const [carModel, setCarModel] = useState<string>("");
  const [carNumberPlate, setCarNumberPlate] = useState<string>("");
  const [carProductionYear, setCarProductionYear] = useState<string>("");

  const handleClose = () => {
    setShow(false);
    setCarBrand("");
    setCarChassisNumber("");
    setCarDriveability("");
    setCarId(0);
    setCarMaintenanceRecord("");
    setCarModel("");
    setCarNumberPlate("");
    setCarProductionYear("");
  };

  const editCar = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/car/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + getLocalStorage()?.token,
        },
      });
      if (response.ok) {
        const car: I_Car = await response.json();
        setCarBrand(car.brand);
        setCarChassisNumber(car.chassisNumber);
        setCarDriveability(car.driveability);
        setCarId(car.id);
        setCarMaintenanceRecord(car.maintenanceRecord);
        setCarModel(car.model);
        setCarNumberPlate(car.numberPlate);
        setCarProductionYear(car.productionYear);
        setShow(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditCarRequest = async () => {
    if (
      !carBrand ||
      !carChassisNumber ||
      !carDriveability ||
      !carMaintenanceRecord ||
      !carModel ||
      !carNumberPlate ||
      !carProductionYear
    ) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/api/car/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + getLocalStorage()?.token,
        },
        body: JSON.stringify({
          brand: carBrand,
          chassisNumber: carChassisNumber,
          driveability: carDriveability,
          id: carId,
          maintenanceRecord: carMaintenanceRecord,
          model: carModel,
          numberPlate: carNumberPlate,
          productionYear: carProductionYear,
        }),
      });
      if (response.ok) {
        fetchCars();
        handleClose();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteCarRequest = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/car/delete/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + getLocalStorage()?.token,
        },
      });
      if (response.ok) {
        fetchCars();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <UtilModal
        handleClose={handleClose}
        show={show}
        modalTitle="Auto bearbeiten"
      >
        <Modal.Body>
          <Container fluid>
            <Row>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Marke</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Volkswagen"
                    onChange={(event) => setCarBrand(event.target.value)}
                    value={carBrand}
                  />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Fahrgestellnummer</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="123456789"
                    onChange={(event) =>
                      setCarChassisNumber(event.target.value)
                    }
                    value={carChassisNumber}
                  />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Fahrbarkeit</Form.Label>
                  <Form.Control
                    as="select"
                    onChange={(event) => setCarDriveability(event.target.value)}
                  >
                    <option value="">Fahrbarkeit auswählen</option>
                    <option value="fahrbereit">Fahrbereit</option>
                    <option value="Nicht Fahrbereit">Nicht Fahrbereit</option>
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Wartungsstand</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="..."
                    onChange={(event) =>
                      setCarMaintenanceRecord(event.target.value)
                    }
                    value={carMaintenanceRecord}
                  />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Modell</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Golf"
                    onChange={(event) => setCarModel(event.target.value)}
                    value={carModel}
                  />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Kennzeichen</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="ABC123"
                    onChange={(event) => setCarNumberPlate(event.target.value)}
                    value={carNumberPlate}
                  />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Baujahr</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="2022"
                    onChange={(event) =>
                      setCarProductionYear(event.target.value)
                    }
                    value={carProductionYear}
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
          <Button variant="success" onClick={handleEditCarRequest}>
            Senden
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
                    {serviceEntities &&  serviceEntities?.map(x => x.name).join(", ")}
                  </p>
                </Col>
              </Row>
              <Row>
                <Col md={10}>
                  <Button variant="primary" onClick={editCar}>
                    Editieren
                  </Button>
                </Col>
                <Col md={2} className="text-end">
                  <Button variant="danger" onClick={handleDeleteCarRequest}>Löschen</Button>
                </Col>
              </Row>
            </Container>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </>
  );
}
