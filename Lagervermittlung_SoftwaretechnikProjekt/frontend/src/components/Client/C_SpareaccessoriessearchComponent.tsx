import { useState } from "react";
import { Form, Button, Container, Row, Col, Stack } from "react-bootstrap";
import C_Spareaccessory from "./Utilities/C_Spareaccessory";
import { I_SpareAccessoryPart } from "../../Interfaces";
import { getLocalStorage } from "../../Auth";
import { useNavigate } from "react-router-dom";

export default function C_SpareaccessoriessearchComponent() {
  const [spareaccessories, setSpareaccessories] = useState<
    I_SpareAccessoryPart[]
  >([]);
  const [selectedBrand, setSelectedBrand] = useState<string>("");
  const [selectedModel, setSelectedModel] = useState<string>("");
  const navigate = useNavigate();

  const searchSpareaccessories = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    if (selectedBrand.replace(" ", "") === "" || selectedModel.replace(" ", "") === "") return;

    try {
        const response = await fetch(`http://localhost:8080/api/SAP/search/${selectedModel}/${selectedBrand}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + getLocalStorage()?.token,
          },
        });

        
        if(response.ok) {
          const spas: I_SpareAccessoryPart[] = await response.json();
          setSpareaccessories(spas);
        }
    } catch (error) {
      return;
    }
  };

  const reserve = async (id: number) => {
    if(!id) return;

    try {
      const response = await fetch(`http://localhost:8080/api/SAP/reserve/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + getLocalStorage()?.token,
        },
      });
      if(response.ok) {
        navigate("/c/spareaccessories");
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Container fluid>
      <Stack gap={4}>
        <Form>
          <Row>
            <Col md={5}>
              <Form.Group className="mb-3" controlId="basicBrand">
                <Form.Label>Automarke</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Volkswagen"
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  value={selectedBrand}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={5}>
              <Form.Group className="mb-3" controlId="basicModel">
                <Form.Label>Modell</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Scirocco"
                  onChange={(e) => setSelectedModel(e.target.value)}
                  value={selectedModel}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={2}>
              <Button
                variant="primary"
                className="mt-4"
                onClick={e => searchSpareaccessories(e)}
                type="submit"
              >
                Suchen
              </Button>
            </Col>
          </Row>
        </Form>
        <Row className="mb-4">
          <Col>
            <Stack gap={2}>
              {spareaccessories.map((spareaccessory) => (
                <C_Spareaccessory
                  key={spareaccessory.id}
                  spareaccessory={spareaccessory}
                  shouldShowRequestOfferButton={true}
                  requestOffer={reserve}
                />
              ))}
            </Stack>
          </Col>
        </Row>
      </Stack>
    </Container>
  );
}
