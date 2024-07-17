import { Col, Container, ListGroup, Row } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { Outlet } from "react-router-dom";

export default function SpareAccessoryDealerPage() {
  return (
    <Container fluid>
      <Row>
        <Col md={3} className="bg-light sidebar">
          <h4>Profil</h4>
          <ListGroup>
            <LinkContainer to="/sad/home">
              <ListGroup.Item action>Home</ListGroup.Item>
            </LinkContainer>
          </ListGroup>
          <ListGroup>
            <LinkContainer to="/logout" style={{ marginTop: "1rem" }}>
              <ListGroup.Item action variant="danger">
                Log Out
              </ListGroup.Item>
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
