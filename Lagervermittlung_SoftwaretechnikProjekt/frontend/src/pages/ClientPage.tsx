import { Col, Container, Row, ListGroup } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { Outlet } from "react-router-dom";

export default function ClientPage() {
  return (
    <Container fluid>
      <Row>
        <Col md={3} className="bg-light sidebar">
          <h4>Profil</h4>
          <ListGroup>
            <LinkContainer to="/c/cars">
              <ListGroup.Item action>Fahrzeuge</ListGroup.Item>
            </LinkContainer>
            <LinkContainer to="/c/spareaccessories">
              <ListGroup.Item action>Ersatzteile</ListGroup.Item>
            </LinkContainer>
            <LinkContainer to="/c/storagesearch">
              <ListGroup.Item action>Lagersuche</ListGroup.Item>
            </LinkContainer>
            <LinkContainer to="/c/spareaccessoriessearch">
              <ListGroup.Item action>Ersatzteilsuche</ListGroup.Item>
            </LinkContainer>
            <LinkContainer to="/c/notifications">
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
