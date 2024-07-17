import { useEffect, useState } from "react";
import { Alert, Stack } from "react-bootstrap";
import C_Spareaccessory from "./Utilities/C_Spareaccessory";
import { I_SpareAccessoryPart } from "../../Interfaces";
import { getLocalStorage } from "../../Auth";

export default function C_SpareaccessoriesComponent() {
  const [spareaccessories, setSpareaccessories] = useState<I_SpareAccessoryPart[]>([]);

  const fetchSpareAccessories = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/SAP/my`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + getLocalStorage()?.token,
        },
      });
  
      if(response.ok) {
        const spas: I_SpareAccessoryPart[] = await response.json();
        setSpareaccessories(spas);
      }
    } catch (error) {
      console.log(error);
      return;
    }
  }

  useEffect(() => {
    fetchSpareAccessories();
  }, []);

  return (
    <div className="p-3">
    {spareaccessories.length === 0 ? (
      <Alert variant="warning ">
        <Alert.Heading>Keine Ersatz- oder Zubehörteile gefunden</Alert.Heading>
        <p>
          Wir konnten leider keine Ersatz- oder Zubehörteile für diesen Account finden. 
        </p>
        <hr />
        <p className="mb-0">
          Wenn Sie ein Ersatz- oder Zubehörteil reservieren, wird Ihnen dieses hier angezeigt. 
        </p>
      </Alert>
    ) : (
      <Stack gap={2}>
        {spareaccessories.map((spareaccessories) => (
          <C_Spareaccessory key={spareaccessories.id} spareaccessory={spareaccessories} />
        ))}
      </Stack>
    )}
  </div>
  )
}