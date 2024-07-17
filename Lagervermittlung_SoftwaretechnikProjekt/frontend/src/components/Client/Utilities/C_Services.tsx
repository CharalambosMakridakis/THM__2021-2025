import { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import { getLocalStorage } from "../../../Auth";
import { I_Service } from "../../../Interfaces";


type Props = {
  setSelectedService: (serviceId: number) => void,
  carId: number;
};

export default function C_Services({ setSelectedService, carId}: Props) {
  const [services, setServices] = useState<I_Service[]>([]);

  useEffect(() => {
    const fetchServices = async () => {
      const response = await fetch("http://localhost:8080/api/car/servicesForCar/" + carId, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + getLocalStorage()?.token,
        },
      });
      const services = await response.json();
      setServices(services);
    };
    fetchServices();
  }, []);

  return (
    <>
      <Form.Group controlId="formRole" className="mt-3">
        <Form.Control
          as="select"
          name="service"
          onChange={(event) =>
            setSelectedService(event.target.value as unknown as number)
          }
          required
        >
          <option value={0}>Wähle ein Service aus</option>
          {services.map((service) => (
            <option key={service.id} value={service.id}>
              {service.name} - {service.price}€ - {service.description}
            </option>
          ))}
        </Form.Control>
      </Form.Group>
    </>
  );
}
