import { Accordion, Button, Col, Container, Row } from "react-bootstrap";
import { I_SpareAccessoryPart } from "../../../Interfaces";

type Props = {
  spareaccessory: I_SpareAccessoryPart,
  requestOffer?: (id: number) => void,
  shouldShowRequestOfferButton?: boolean,
};

function C_Spareaccessory({
  spareaccessory: { articleNumber, description, designation, id, price },
  requestOffer,
  shouldShowRequestOfferButton = false,
}: Props) {
  return (
    <Accordion key={id}>
      <Accordion.Item eventKey={id.toString()}>
        <Accordion.Header>
          <Container fluid>
            <Row style={{ display: "flex", alignItems: "center" }}>
              <Col md={10}>
                <h1 style={{ fontWeight: "bold" }}>{designation}</h1>
              </Col>
            </Row>
          </Container>
        </Accordion.Header>
        <Accordion.Body>
          <Container fluid>
            <Row>
              <Col md={6}>
                <p>
                  <span style={{ fontWeight: "bold" }}>Beschreibung:</span>{" "}
                  {description}
                </p>
                <p>
                  <span style={{ fontWeight: "bold" }}>Kosten:</span> {price} €
                </p>
              </Col>
              <Col md={6}>
                <p>
                  <span style={{ fontWeight: "bold" }}>Artikelnummer:</span>{" "}
                  {articleNumber}
                </p>
              </Col>
            </Row>
            {
              // If the requestOffer function is passed as a prop, show the request offer button
              shouldShowRequestOfferButton && (
                <Row>
                  <Col md={12} className="text-end">
                    <Button variant="primary" onClick={() => requestOffer(id)}>Reservieren</Button>
                  </Col>
                </Row>
              )
            }
          </Container>
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  );
}

export default C_Spareaccessory;
