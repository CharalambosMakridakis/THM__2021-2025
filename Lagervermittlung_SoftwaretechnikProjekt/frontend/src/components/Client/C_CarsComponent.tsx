import { Alert, Stack } from "react-bootstrap";
import { useEffect, useState } from "react";
import { getLocalStorage } from "../../Auth";
import { I_Car } from "../../Interfaces";
import C_Car from "./Utilities/C_Car";
import { useNavigate } from "react-router-dom";

export default function C_CarsComponent() {
  const [car, setCars] = useState<I_Car[]>([]);
  const navigate = useNavigate();

  const fetchCars = async () => {
    const response = await fetch("http://localhost:8080/api/car/myCars", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + getLocalStorage()?.token,
      },
    });
    const cars = await response.json();
    setCars(cars);
  };

  useEffect(() => {
    fetchCars();
  }, []);

  const bookService = async (carId: number, serviceId: number) => {
    try {
      const response = await fetch(`http://localhost:8080/api/car/bookServiceForCar/${serviceId}/${carId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + getLocalStorage()?.token,
        },
      });
      if(response.ok){
        fetchCars();
      }
    } catch (error) {
      return;
    }
    
  };

  return (
    <div className="p-3">
      {car.length === 0 ? (
        <Alert variant="warning ">
          <Alert.Heading>Keine Fahrzeuge gefunden</Alert.Heading>
            <p>
              Wir konnten leider keine Fahrzeuge für diesen Account finden. 
            </p>
            <hr />
            <p className="mb-0">
              Sollten Sie kürzlich eine Fahrzeug eingelagert haben, wird der Lagerhalter dieses bald hier eintragen. 
            </p>
        </Alert>
      ) : (
        <Stack gap={2}>
          {car.map((car) => (
            <C_Car key={car.id} car={car} bookService={bookService} />
          ))}
        </Stack>
      )}
    </div>
  );
}
