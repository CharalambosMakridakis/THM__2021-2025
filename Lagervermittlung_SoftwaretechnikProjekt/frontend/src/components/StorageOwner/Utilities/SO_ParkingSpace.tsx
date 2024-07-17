import { Col, Container, Form, Row } from "react-bootstrap";

type Props = {
    category: string,
    conditions: string,
    setCategory: (category: string) => void,
    setConditions: (conditions: string) => void,
}

export default function SO_ParkingSpace({category, conditions, setCategory, setConditions}: Props) {

  return (
    <Container fluid>
      <Row>
        <Col md={12}>
          <Form.Group className="mb-3">
            <Form.Label>Kategorie</Form.Label>
            <Form.Control
              type="text"
              placeholder="Glasbox"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
            />
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col md={12}>
          <Form.Group className="mb-3">
            <Form.Label>Konditionen</Form.Label>
            <Form.Control
              as="textarea"
              placeholder="150€/Monat, ..."
              value={conditions}
              onChange={(event) => setConditions(event.target.value)}
            />
          </Form.Group>
        </Col>
      </Row>
    </Container>
  );
}
