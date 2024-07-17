import { ChangeEvent, useEffect, useState } from "react";
import UtilModal from "../../../Utilities/UtilModal";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  Modal,
  Row,
} from "react-bootstrap";
import { getLocalStorage } from "../../../Auth";
import { I_Storage } from "../../../Interfaces";

type Props = {
  fetchCars: () => void;
};

interface I_ParkingSpaceResponse {
  id: number;
  category: string;
  conditions: string;
  carId: number;
}

export default function SO_CreateCar({ fetchCars }: Props) {
  const [show, setShow] = useState(false);
  const [warehouses, setWarehouses] = useState<I_Storage[]>([]);
  const [parkingSpaces, setParkingSpaces] = useState<I_ParkingSpaceResponse[]>(
    []
  );
  const [selectedParkingspaceId, setSelectedParkingspaceId] =
    useState<number>();
  const [userEmail, setUserEmail] = useState<string>("");

  const [model, setModel] = useState("");
  const [productionYear, setProductionYear] = useState("");
  const [brand, setBrand] = useState("");
  const [numberPlate, setNumberPlate] = useState("");
  const [chassisNumber, setChassisNumber] = useState("");
  const [maintenanceRecord, setMaintenanceRecord] = useState("");
  const [driveability, setDriveability] = useState("");

  const handleClose = () => {
    setShow(false);
    setModel("");
    setProductionYear("");
    setBrand("");
    setNumberPlate("");
    setChassisNumber("");
    setMaintenanceRecord("");
    setDriveability("");
    setUserEmail("");
  };

  const createCar = async () => {
    if (
      model === "" ||
      productionYear === "" ||
      brand === "" ||
      numberPlate === "" ||
      chassisNumber === "" ||
      maintenanceRecord === "" ||
      driveability === "" ||
      selectedParkingspaceId === undefined ||
      userEmail === ""
    ) {
      return;
    }
    try {
      const response = await fetch(
        `http://localhost:8080/api/car/createByStorageOwner/${selectedParkingspaceId}/${userEmail}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + getLocalStorage()?.token,
          },
          body: JSON.stringify({
            model: model,
            productionYear: productionYear,
            brand: brand,
            numberPlate: numberPlate,
            chassisNumber: chassisNumber,
            maintenanceRecord: maintenanceRecord,
            driveability: driveability,
          }),
        }
      );
      if (response.ok) {
        fetchCars();
        handleClose();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchWarehouses = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/warehouses/myWarehouses", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + getLocalStorage()?.token,
        },
      });
      if (response.ok) {
        const warehouses: I_Storage[] = await response.json();
        setWarehouses(warehouses);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchParkingSpaces = async (warehouseId: number) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/warehouses/${warehouseId}/parkingspaces`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + getLocalStorage()?.token,
          },
        }
      );
      if (response.ok) {
        const parkingSpaces: I_ParkingSpaceResponse[] = await response.json();
        console.log(parkingSpaces);
        const parkingSpacesWithoutCar: I_ParkingSpaceResponse[] =
          parkingSpaces.filter((parkingspace) => parkingspace.carId === null);
        setParkingSpaces(parkingSpacesWithoutCar);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSelectedWarehouse = async (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (event.target.value === "") {
      setParkingSpaces([]);
      return;
    }
    await fetchParkingSpaces(Number(event.target.value as unknown as number));
  };

  useEffect(() => {
    fetchWarehouses();
  }, []);

  return (
    <>
      <Card
        body
        onClick={() => setShow(true)}
        className="text-center"
        role="button"
      >
        <h1>+</h1>
      </Card>

      <UtilModal
        handleClose={handleClose}
        show={show}
        modalTitle="Auto hinzufügen"
      >
        <Modal.Body>
          <Container fluid>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Modell</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Modell"
                    value={model}
                    onChange={(event) => setModel(event.target.value)}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Produktionsjahr</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Produktionsjahr"
                    value={productionYear}
                    onChange={(event) => setProductionYear(event.target.value)}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Marke</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Marke"
                    value={brand}
                    onChange={(event) => setBrand(event.target.value)}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Kennzeichen</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Kennzeichen"
                    value={numberPlate}
                    onChange={(event) => setNumberPlate(event.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Fahrgestellnummer</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Fahrgestellnummer"
                    value={chassisNumber}
                    onChange={(event) => setChassisNumber(event.target.value)}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Wartungsprotokoll</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Wartungsprotokoll"
                    value={maintenanceRecord}
                    onChange={(event) =>
                      setMaintenanceRecord(event.target.value)
                    }
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Fahrbarkeit</Form.Label>
                  <Form.Control
                    as="select"
                    onChange={(event) => setDriveability(event.target.value)}
                  >
                    <option value="">Fahrbarkeit auswählen</option>
                    <option value="fahrbereit">Fahrbereit</option>
                    <option value="Nicht Fahrbereit">Nicht Fahrbereit</option>
                  </Form.Control>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>E-Mail Einlagerer</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="max.mustermann@gmail.com"
                    value={userEmail}
                    onChange={(event) => setUserEmail(event.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={12}>
                <Form.Group>
                  <Form.Label>Lager</Form.Label>
                  <Form.Control
                    as="select"
                    onChange={(event) => handleSelectedWarehouse(event)}
                  >
                    <option value="">Wähle ein Lager aus</option>
                    {warehouses.map((warehouse) => (
                      <option key={warehouse.id} value={warehouse.id}>
                        {warehouse.name}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={12}>
                <Form.Group>
                  <Form.Label>Stellplatz</Form.Label>
                  <Form.Control
                    as="select"
                    onChange={(event) =>
                      setSelectedParkingspaceId(
                        event.target.value as unknown as number
                      )
                    }
                  >
                    <option value={undefined}>Wähle ein Stellplatz aus</option>
                    {parkingSpaces.map((parkingspace) => (
                      <option key={parkingspace.id} value={parkingspace.id}>
                        {parkingspace.category}
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
          <Button variant="success" onClick={createCar}>
            Erstellen
          </Button>
        </Modal.Footer>
      </UtilModal>
    </>
  );
}
