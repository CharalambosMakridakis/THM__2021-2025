import { Col, Container, Row, ListGroup } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { Outlet } from "react-router-dom";

export default function StorageOwnerPage() {
  return (
    <Container fluid>
      <Row>
        <Col md={3} className="bg-light sidebar">
          <h4>Dashboard</h4>
          <ListGroup>
            <LinkContainer to="/so/storage">
              <ListGroup.Item action>Lager</ListGroup.Item>
            </LinkContainer>
            <LinkContainer to="/so/cars">
              <ListGroup.Item action>Fahrzeuge</ListGroup.Item>
            </LinkContainer>
            <LinkContainer to="/so/workshops">
              <ListGroup.Item action>Werkstätte</ListGroup.Item>
            </LinkContainer>
            <LinkContainer to="/so/notifications">
              <ListGroup.Item action>Mitteilungen</ListGroup.Item>
            </LinkContainer>
          </ListGroup>
          <ListGroup>
            <LinkContainer to="/logout" style={{marginTop: "1rem"}}>
              <ListGroup.Item action variant="danger">Log Out</ListGroup.Item>
            </LinkContainer>
          </ListGroup>
        </Col>
        <Col md={9} className="content">
          <Outlet />
        </Col>
      </Row>
    </Container>
  );
}

