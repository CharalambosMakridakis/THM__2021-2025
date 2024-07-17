import { Col, Container, Row, ListGroup } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { Outlet } from "react-router-dom";

export default function WorkshopOwnerPage() {
  return (
    <Container fluid>
    <Row>
      <Col md={3} className="bg-light sidebar">
        <h4>Profil</h4>
        <ListGroup>
          <LinkContainer to="/wo/workshop">
            <ListGroup.Item action>Werkstatt</ListGroup.Item>
          </LinkContainer>
          <LinkContainer to="/wo/notifications">
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