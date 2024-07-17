import { Card } from "react-bootstrap";

type Props = {
    cardHeader: string,
    children: React.ReactNode
}

export default function UtilCard({cardHeader, children}: Props) {
  return (
    <Card>
      <Card.Header>{cardHeader}</Card.Header>
      <Card.Body>
        {children}
      </Card.Body>
    </Card>
  );
}
