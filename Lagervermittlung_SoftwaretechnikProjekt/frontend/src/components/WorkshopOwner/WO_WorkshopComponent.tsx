import { useEffect, useState } from "react";
import { Stack } from "react-bootstrap";
import { getLocalStorage } from "../../Auth";
import { I_Workshop } from "../../Interfaces";
import WO_CreateWorkshop from "./Utilities/WO_CreateWorkshop";
import WO_Workshop from "./Utilities/WO_Workshop";

export default function WO_WorkshopComponent() {
  const [workshop, setWorkshop] = useState<I_Workshop>();

  const fetchWorkshop = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/workshops/my", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + getLocalStorage()?.token,
        },
      });
      if (response.ok) {
        const workshop: I_Workshop = await response.json();
        setWorkshop(workshop);
      } else if (response.status === 404) {
        setWorkshop(undefined);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchWorkshop();
  }, []);

  return (
    <>
      <Stack gap={2}>
        {
          !workshop ? (
            <WO_CreateWorkshop fetchWorkshop={fetchWorkshop} />
          ) : (
            <WO_Workshop workshop={workshop} fetchWorkshop={fetchWorkshop} />
          )
        }
      </Stack>
    </>
  );
}
