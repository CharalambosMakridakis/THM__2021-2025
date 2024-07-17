import { useState } from "react";
import { Form, Button, Container, Row, Col, Stack } from "react-bootstrap";
import C_Storage from "./Utilities/C_Storage";
import { I_Storage } from "../../Interfaces";
import { getLocalStorage } from "../../Auth";

export default function C_StoragesearchComponent() {
  const [storages, setStorages] = useState<I_Storage[]>([]);
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [selectedCarBrand, setSelectedCarBrand] = useState<string>("");

  const searchStorages = async () => {
    if (selectedCity === "" || selectedCarBrand === "") return;

    try {
      const response = await fetch(`http://localhost:8080/api/warehouses/search/${selectedCity}/${selectedCarBrand}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + getLocalStorage()?.token,
          },
        });
    
        if(response.ok) {
          const storagesResponse: I_Storage[] = await response.json();
          console.log(storagesResponse);
          setStorages(storagesResponse);
        }
    } catch (error) {
      return;
    }

  };

  return (
    <Container fluid>
      <Stack gap={4}>
        <Row>
          <Col md={5}>
            <Form.Group>
              <Form.Label>Stadt</Form.Label>
              <Form.Control
                as="select"
                onChange={(event) => setSelectedCity(event.target.value)}
              >
                <option value="">Wähle eine Stadt aus</option>
                <option value="Frankfurt">Frankfurt</option>
                <option value="München">München</option>
                <option value="Berlin">Berlin</option>
                <option value="Hamburg">Hamburg</option>
                <option value="Köln">Köln</option>
                <option value="Stuttgart">Stuttgart</option>
                <option value="Düsseldorf">Düsseldorf</option>
                <option value="Dortmund">Dortmund</option>
                <option value="Essen">Essen</option>
                <option value="Leipzig">Leipzig</option>
                <option value="Bremen">Bremen</option>
                <option value="Dresden">Dresden</option>
                <option value="Hannover">Hannover</option>
                <option value="Nürnberg">Nürnberg</option>
                <option value="Duisburg">Duisburg</option>
                <option value="Bochum">Bochum</option>
                <option value="Wuppertal">Wuppertal</option>
                <option value="Bielefeld">Bielefeld</option>
                <option value="Bonn">Bonn</option>
                <option value="Münster">Münster</option>
                <option value="Karlsruhe">Karlsruhe</option>
              </Form.Control>
            </Form.Group>
          </Col>
          <Col md={5}>
            <Form.Group>
              <Form.Label>Automarke</Form.Label>
              <Form.Control
                as="select"
                onChange={(event) => setSelectedCarBrand(event.target.value)}
              >
                <option value="">Wähle eine Marke aus</option>
                <option value="Audi">Audi</option>
                <option value="BMW">BMW</option>
                <option value="Ford">Ford</option>
                <option value="Mercedes">Mercedes</option>
                <option value="Opel">Opel</option>
                <option value="Volkswagen">Volkswagen</option>
                <option value="Porsche">Porsche</option>
                <option value="Toyota">Toyota</option>
                <option value="Nissan">Nissan</option>
                <option value="Renault">Renault</option>
                <option value="Peugeot">Peugeot</option>
                <option value="Fiat">Fiat</option>
                <option value="Skoda">Skoda</option>
                <option value="Seat">Seat</option>
                <option value="Hyundai">Hyundai</option>
                <option value="Kia">Kia</option>
                <option value="Mazda">Mazda</option>
                <option value="Volvo">Volvo</option>
                <option value="Honda">Honda</option>
                <option value="Mitsubishi">Mitsubishi</option>
                <option value="Subaru">Subaru</option>
                <option value="Citroen">Citroen</option>
                <option value="Jaguar">Jaguar</option>
                <option value="Land Rover">Land Rover</option>
                <option value="Mini">Mini</option>
                <option value="Suzuki">Suzuki</option>
                <option value="Dacia">Dacia</option>
                <option value="Jeep">Jeep</option>
                <option value="Alfa Romeo">Alfa Romeo</option>
                <option value="Smart">Smart</option>
                <option value="Chevrolet">Chevrolet</option>
              </Form.Control>
            </Form.Group>
          </Col>
          <Col md={2}>
            <Button variant="primary" className="mt-4" onClick={searchStorages}>
              Suchen
            </Button>
          </Col>
        </Row>
        <Row className="mb-4">
          <Col>
            <Stack gap={2}>
              {storages.map((storage) => (
                <C_Storage key={storage.id} storage={storage} />
              ))}
            </Stack>
          </Col>
        </Row>
      </Stack>
    </Container>
  );
}
