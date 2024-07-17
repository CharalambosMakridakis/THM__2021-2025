import { Col, Container, Form, Row } from "react-bootstrap";

type Props = {
  setServiceName: (name: string) => void,
  setPrice: (price: number) => void,
  setDescription: (desc: string) => void
  serviceName: string,
  price: number,
  description: string
}

export default function SO_Service({setServiceName, setPrice, setDescription, serviceName, price, description}: Props) {

  return (
    <Container fluid>
      <Row>
        <Col md={12}>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Name des Services"
              value={serviceName}
              onChange={(event) => setServiceName(event.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Preis in Euro</Form.Label>
            <Form.Control
              type="number"
              placeholder="20"
              value={price}
              onChange={(event) =>
                setPrice(event.target.value as unknown as number)
              }
            />
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col md={12}>
          <Form.Group className="mb-3">
            <Form.Label>Beschreibung</Form.Label>
            <Form.Control
              as="textarea"
              placeholder="Vollständige Reinigung Ihres Innenraums mit sorgfältig ausgewählten Chemikalien."
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
          </Form.Group>
        </Col>
      </Row>
    </Container>
  );
}
