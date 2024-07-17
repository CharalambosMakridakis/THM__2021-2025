import { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import { I_ParkingSpace } from "../../../Interfaces";

type Props = {
  setSelectedParkinslot: (serviceId: number) => void;
  storageId: number;
};

export default function C_Offer({ setSelectedParkinslot /* storage id for api call */ }: Props) {
  const [parkingslots, setParkingslots] = useState<I_ParkingSpace[]>([]);

  useEffect(() => {
    const parkingslot: I_ParkingSpace[] = [
        {
          id: 1,
          category: "Nass",
          conditions: "Konditionen 1",
          carId: 1
        },
        {
          id: 2,
          category: "Trocken",
          conditions: "Konditionen 2",
          carId: 2
        },
        {
          id: 3,
          category: "Nass",
          conditions: "Konditionen 3",
          carId: 3
        },
    ];
    setParkingslots(parkingslot);
  }, []);

  return (
    <>
      <Form.Group controlId="formRole" className="mt-3">
        <Form.Control
          as="select"
          name="service"
          onChange={(event) =>
            setSelectedParkinslot(event.target.value as unknown as number)
          }
          required
        >
          <option value={0}>Wähle ein Stellplatz aus</option>
          {parkingslots.map((parkingslot) => (
            <option key={parkingslot.id} value={parkingslot.id}>
              {parkingslot.category} - {parkingslot.conditions}€
            </option>
          ))}
        </Form.Control>
      </Form.Group>
    </>
  );
}
