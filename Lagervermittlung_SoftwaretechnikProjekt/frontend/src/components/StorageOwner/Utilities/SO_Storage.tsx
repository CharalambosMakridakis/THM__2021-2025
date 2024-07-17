import {
  Accordion,
  Container,
  Row,
  Col,
  Button,
  Modal,
  Stack,
  Card,
  Badge,
} from "react-bootstrap";
import UtilModal from "../../../Utilities/UtilModal";
import { useState } from "react";
import { I_ParkingSpace, I_Storage } from "../../../Interfaces";
import { getLocalStorage } from "../../../Auth";
import SO_CreateEditStorage from "./SO_CreateEditStorage";
import SO_Service from "./SO_Service";
import SO_ParkingSpace from "./SO_ParkingSpace";

type Props = {
  storage: I_Storage;
  fetchStorages: () => void;
};

export default function SO_Storage({
  storage: {
    address,
    brandSpecialization,
    id,
    name,
    openingHours,
    storageConditions,
    services,
    parkingSpaces,
  },
  fetchStorages,
}: Props) {
  const [show2, setShow2] = useState<boolean>(false);
  const [show3, setShow3] = useState<boolean>(false);

  const [sId, setSId] = useState<number>(0);
  const [serviceName, setServiceName] = useState<string>("");
  const [price, setPrice] = useState<number>(0);
  const [description, setDescription] = useState<string>("");

  const [pId, setPId] = useState<number>(0);
  const [category, setCategory] = useState<string>("");
  const [conditions, setConditions] = useState<string>("");
  const [carId, setCarId] = useState<number | null>(null);

  const [isUpdateService, setIsUpdateService] = useState<boolean>(false);
  const [isUpdateParkingSpace, setIsUpdateParkingSpace] =
    useState<boolean>(false);

  const handleClose = () => {
    setServiceName("");
    setPrice(0);
    setDescription("");
    setSId(0);
    setShow2(false);
    setIsUpdateService(false);
  };

  const handleClose3 = () => {
    setCategory("");
    setConditions("");
    setPId(0);
    setCarId(null);
    setShow3(false);
    setIsUpdateParkingSpace(false);
  };

  const handleDeleteParkingSpaceRequest = async (pid: number) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/parkingspaces/delete/${pid}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + getLocalStorage()?.token,
          },
        }
      );
      if (response.ok) {
        fetchStorages();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const editService = async (serviceId: number) => {
    setIsUpdateService(true);
    try {
      const response = await fetch(
        `http://localhost:8080/api/services/${serviceId}`,
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
        setServiceName(data.name);
        setPrice(data.price);
        setDescription(data.description);
        setSId(serviceId);
        setShow2(true);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleEditServiceRequest = async () => {
    if (serviceName === "" || price === 0 || description === "") return;
    try {
      const response = await fetch(
        `http://localhost:8080/api/services/update`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + getLocalStorage()?.token,
          },
          body: JSON.stringify({
            id: sId,
            name: serviceName,
            price: price,
            description: description,
          }),
        }
      );
      if (response.ok) {
        fetchStorages();
        handleClose();
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleDeleteServiceRequest = async (serviceId: number) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/services/delete/${serviceId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + getLocalStorage()?.token,
          },
        }
      );
      if (response.ok) {
        fetchStorages();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const addServiceToStorage = async (serviceId: number) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/warehouses/${id}/services/add/${serviceId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + getLocalStorage()?.token,
          },
        }
      );
      if (response.ok) {
        fetchStorages();
      }
    } catch (error) {
      console.log(error);
    }
    handleClose();
  };

  const handleAddServiceRequest = async () => {
    if (serviceName === "" || price === 0 || description === "") return;

    try {
      const response = await fetch(
        "http://localhost:8080/api/services/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + getLocalStorage()?.token,
          },
          body: JSON.stringify({
            name: serviceName,
            price: price,
            description: description,
          }),
        }
      );
      if (response.ok) {
        const data = await response.json();
        addServiceToStorage(data.id);
      }
    } catch (error) {
      console.log(error);
    }
    handleClose();
  };
  const handleAddParkingSpaceRequest = async () => {
    if (category === "" || conditions === "") return;
    try {
      const response = await fetch(
        `http://localhost:8080/api/parkingspaces/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + getLocalStorage()?.token,
          },
          body: JSON.stringify({
            category: category,
            conditions: conditions,
          }),
        }
      );
      if (response.ok) {
        const data = await response.json();
        addParkingSpaceToStorage(data.id);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const addParkingSpaceToStorage = async (parkingSpaceId: number) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/warehouses/${id}/parkingspaces/add/${parkingSpaceId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + getLocalStorage()?.token,
          },
        }
      );
      if (response.ok) {
        fetchStorages();
        handleClose3();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteStorageRequest = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/warehouses/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + getLocalStorage()?.token,
          },
        }
      );
      if (response.ok) {
        fetchStorages();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const editParkingSpace = async (parkingSpaceId: number) => {
    setIsUpdateParkingSpace(true);
    try {
      const response = await fetch(
        `http://localhost:8080/api/parkingspaces/${parkingSpaceId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + getLocalStorage()?.token,
          },
        }
      );
      if (response.ok) {
        const data: I_ParkingSpace = await response.json();
        setCategory(data.category);
        setConditions(data.conditions);
        setPId(parkingSpaceId);
        if (data.car) {
          setCarId(data.car.id);
        }
        setShow3(true);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleEditParkingSpaceRequest = async () => {
    if (category === "" || conditions === "") return;
    try {
      const response = await fetch(
        `http://localhost:8080/api/parkingspaces/update`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + getLocalStorage()?.token,
          },
          body: JSON.stringify({
            id: pId,
            category: category,
            conditions: conditions,
            carId: carId
          }),
        }
      );
      if (response.ok) {
        fetchStorages();
        handleClose3();
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
        show={show2}
        modalTitle={
          isUpdateService ? "Service editieren" : "Service hinzufügen"
        }
      >
        <Modal.Body>
          <SO_Service
            setServiceName={setServiceName}
            setPrice={setPrice}
            setDescription={setDescription}
            serviceName={serviceName}
            description={description}
            price={price}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleClose}>
            Schließen
          </Button>
          {isUpdateService ? (
            <Button
              variant="success"
              onClick={() => handleEditServiceRequest()}
            >
              Senden
            </Button>
          ) : (
            <Button variant="success" onClick={() => handleAddServiceRequest()}>
              Senden
            </Button>
          )}
        </Modal.Footer>
      </UtilModal>
      <UtilModal
        handleClose={handleClose3}
        show={show3}
        modalTitle={
          isUpdateParkingSpace
            ? "Stellplatz editieren"
            : "Stellplatz hinzufügen"
        }
      >
        <Modal.Body>
          <SO_ParkingSpace
            category={category}
            conditions={conditions}
            setCategory={setCategory}
            setConditions={setConditions}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleClose3}>
            Schließen
          </Button>
          {isUpdateParkingSpace ? (
            <Button
              variant="success"
              onClick={() => handleEditParkingSpaceRequest()}
            >
              Senden
            </Button>
          ) : (
            <Button
              variant="success"
              onClick={() => handleAddParkingSpaceRequest()}
            >
              Senden
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
                  <h1 style={{ fontWeight: "bold" }}>{name}</h1>
                </Col>
              </Row>
            </Container>
          </Accordion.Header>
          <Accordion.Body>
            <Container fluid>
              <Row>
                <Col md={4}>
                  <p>
                    <span style={{ fontWeight: "bold" }}>Adresse:</span>{" "}
                    {address}
                  </p>
                </Col>
                <Col md={4}>
                  <p>
                    <span style={{ fontWeight: "bold" }}>
                      Markenspezialisierung:
                    </span>{" "}
                    {brandSpecialization}
                  </p>
                </Col>
                <Col md={4}>
                  <p>
                    <span style={{ fontWeight: "bold" }}>
                      Lagerbedingungen:
                    </span>{" "}
                    {storageConditions}
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
                    Services
                  </span>{" "}
                  <Stack gap={4}>
                    {services.map((service, index) => (
                      <Card key={index}>
                        <Card.Header>
                          <Container fluid>
                            <Row>
                              <Col md={4}>{service.name}</Col>
                              <Col md={2}>{service.price}€</Col>
                              <Col md={3} className="text-end">
                                <Button
                                  variant="primary"
                                  onClick={() => editService(service.id)}
                                >
                                  Editieren
                                </Button>
                              </Col>
                              <Col md={3} className="text-end">
                                <Button
                                  variant="danger"
                                  onClick={() =>
                                    handleDeleteServiceRequest(service.id)
                                  }
                                >
                                  Löschen
                                </Button>
                              </Col>
                            </Row>
                          </Container>
                        </Card.Header>
                        <Card.Body>{service.description}</Card.Body>
                      </Card>
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
                    Stellplätze
                  </span>{" "}
                  <Stack gap={4}>
                    {parkingSpaces.map((parkingspace, index) => (
                      <Card key={index}>
                        <Card.Header>
                          <Container fluid>
                            <Row>
                              <Col md={4}>{parkingspace.category}</Col>
                              <Col md={4} className="text-end">
                                <Button
                                  variant="primary"
                                  onClick={() =>
                                    editParkingSpace(parkingspace.id)
                                  }
                                >
                                  Editieren
                                </Button>
                              </Col>
                              <Col md={4} className="text-end">
                                <Button
                                  variant="danger"
                                  onClick={() =>
                                    handleDeleteParkingSpaceRequest(
                                      parkingspace.id
                                    )
                                  }
                                >
                                  Löschen
                                </Button>
                              </Col>
                            </Row>
                          </Container>
                        </Card.Header>
                        <Card.Body>{parkingspace.conditions}</Card.Body>
                        <Card.Body>
                          {parkingspace.car ? (
                            <Badge bg="success">
                              {parkingspace.car.brand} {parkingspace.car.model}{" "}
                              {parkingspace.car.numberPlate}
                            </Badge>
                          ) : (
                            <Badge bg="success">Frei</Badge>
                          )}
                        </Card.Body>
                      </Card>
                    ))}
                  </Stack>
                </Col>
              </Row>
              <Row style={{ marginTop: 10 }}>
                <Col md={2}>
                  <SO_CreateEditStorage
                    isForEdit={true}
                    fetchStorages={fetchStorages}
                    storageId={id}
                  />
                </Col>
                <Col md={2}>
                  <Button variant="primary" onClick={() => setShow2(true)}>
                    Service hinzufügen
                  </Button>
                </Col>
                <Col md={3}>
                  <Button variant="primary" onClick={() => setShow3(true)}>
                    Stellplatz hinzufügen
                  </Button>
                </Col>
                <Col md={5} className="text-end">
                  <Button variant="danger" onClick={handleDeleteStorageRequest}>
                    Lager löschen
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
