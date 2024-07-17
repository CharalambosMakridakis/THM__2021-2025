import { Alert, Stack } from "react-bootstrap";
import { useEffect, useState } from "react";
import { getLocalStorage } from "../../Auth";
import { I_Workshop } from "../../Interfaces";
import SO_Workshop from "./Utilities/SO_Workshop";

export default function SO_WorkshopsComponent() {
  const [workshops, setWorkshops] = useState<I_Workshop[]>([]);

  const fetchStorages = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/workshops/all", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + getLocalStorage()?.token,
        },
      });
      if (response.ok) {
        const workshops: I_Workshop[] = await response.json();
        setWorkshops(workshops);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchStorages();
  }, []);

  return (
    <>
      {workshops.length === 0 ? (
        <Alert variant="warning ">
          <Alert.Heading>Keine Werkstätten gefunden</Alert.Heading>
          <p>Wir konnten leider keine Werkstätten finden.</p>
          <hr />
          <p className="mb-0">
            Alsbald wird sich eine Werkstatt registrieren, die Sie anfragen
            können.
          </p>
        </Alert>
      ) : (
        <Stack gap={2}>
          {workshops.map((workshop) => (
            <SO_Workshop key={workshop.id} workshop={workshop} />
          ))}
        </Stack>
      )}
    </>
  );
}
