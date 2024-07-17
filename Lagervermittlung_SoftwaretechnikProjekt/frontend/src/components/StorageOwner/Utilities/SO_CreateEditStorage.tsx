import { useState } from "react";
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
  fetchStorages: () => void;
  isForEdit: boolean;
  storageId?: number;
};

export default function SO_CreateEditStorage({
  fetchStorages,
  isForEdit,
  storageId,
}: Props) {
  const [show, setShow] = useState(false);

  const [adress, setAdress] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [storageConditions, setStorageConditions] = useState<string>("");
  const [brandSpecialization, setBrandSpecialization] = useState<string>("");
  const [id, setId] = useState<number>(-1);

  const [monday, setMonday] = useState<string>("");
  const [tuesday, setTuesday] = useState<string>("");
  const [wednesday, setWednesday] = useState<string>("");
  const [thursday, setThursday] = useState<string>("");
  const [friday, setFriday] = useState<string>("");
  const [saturday, setSaturday] = useState<string>("");
  const [sunday, setSunday] = useState<string>("");

  const handleClose = () => {
    setShow(false);
    setAdress("");
    setName("");
    setStorageConditions("");
    setBrandSpecialization("");
    setMonday("");
    setTuesday("");
    setWednesday("");
    setThursday("");
    setFriday("");
    setSaturday("");
    setSunday("");
  };

  const createStorage = async () => {
    if (
      adress === "" ||
      name === "" ||
      storageConditions === "" ||
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
        "http://localhost:8080/api/warehouses/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + getLocalStorage()?.token,
          },
          body: JSON.stringify({
            name: name,
            address: adress,
            storageConditions: storageConditions,
            brandSpecialization: brandSpecialization,
            openingHours: openingHours,
          }),
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

  const openEditStorageWithPrefilledValues = async () => {
    setShow(true);
    try {
      const response = await fetch(
        `http://localhost:8080/api/warehouses/${storageId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + getLocalStorage()?.token,
          },
        }
      );
      if (response.ok) {
        const data: I_Storage = await response.json();
        setId(data.id);
        setAdress(data.address);
        setName(data.name);
        setStorageConditions(data.storageConditions);
        setBrandSpecialization(data.brandSpecialization);
        setMonday(data.openingHours[0]);
        setTuesday(data.openingHours[1]);
        setWednesday(data.openingHours[2]);
        setThursday(data.openingHours[3]);
        setFriday(data.openingHours[4]);
        setSaturday(data.openingHours[5]);
        setSunday(data.openingHours[6]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditStorageRequest = async () => {
    if (
      adress === "" ||
      name === "" ||
      storageConditions === "" ||
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
        "http://localhost:8080/api/warehouses/update",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + getLocalStorage()?.token,
          },
          body: JSON.stringify({
            id: id,
            name: name,
            address: adress,
            storageConditions: storageConditions,
            brandSpecialization: brandSpecialization,
            openingHours: openingHours,
          }),
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

  return (
    <>
      {isForEdit ? (
        <Button variant="primary" onClick={openEditStorageWithPrefilledValues}>
          Lager editieren
        </Button>
      ) : (
        <Card
          body
          onClick={() => setShow(true)}
          className="text-center"
          role="button"
        >
          <h1>+</h1>
        </Card>
      )}

      <UtilModal
        handleClose={handleClose}
        show={show}
        modalTitle={isForEdit ? "Lager editieren" : "Lager erstellen"}
      >
        <Modal.Body>
          <Container fluid>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Name des Lagers"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Adresse</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Vollständige Adresse"
                    value={adress}
                    onChange={(event) => setAdress(event.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Lagerbedingungen</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="UV-Geschützt, Wachschutz, 24/7-Access"
                    value={storageConditions}
                    onChange={(event) =>
                      setStorageConditions(event.target.value)
                    }
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Markenspezialisierung</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Volkswagen"
                    value={brandSpecialization}
                    onChange={(event) =>
                      setBrandSpecialization(event.target.value)
                    }
                  />
                </Form.Group>
              </Col>
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
            </Row>
          </Container>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleClose}>
            Schließen
          </Button>
          {isForEdit ? (
            <Button variant="success" onClick={handleEditStorageRequest}>
              Ändern
            </Button>
          ) : (
            <Button variant="success" onClick={createStorage}>
              Erstellen
            </Button>
          )}
        </Modal.Footer>
      </UtilModal>
    </>
  );
}
