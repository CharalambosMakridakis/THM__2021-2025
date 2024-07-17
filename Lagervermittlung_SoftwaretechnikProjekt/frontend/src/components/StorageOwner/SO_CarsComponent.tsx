import { Stack } from "react-bootstrap";
import SO_CreateCar from "./Utilities/SO_CreateCar";
import { I_Car } from "../../Interfaces";
import { getLocalStorage } from "../../Auth";
import { useEffect, useState } from "react";
import SO_Car from "./Utilities/SO_Car";

export default function SO_CarsComponent() {
  const [cars, setCars] = useState<I_Car[]>([]);

  const fetchCars = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/car/myCars", {
        method: "GET",
        headers: {
          Authorization: "Bearer " + getLocalStorage()?.token,
        },
      });
      if (response.ok) {
        const cars: I_Car[] = await response.json();
        setCars(cars);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);
  return (
    <Stack gap={2}>
      <SO_CreateCar fetchCars={fetchCars} />
      {cars.map((car, index) => (
        <SO_Car key={index} car={car} fetchCars={fetchCars} />
      ))}
    </Stack>
  );
}
