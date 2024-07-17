import { Stack } from "react-bootstrap";
import { useEffect, useState } from "react";
import SO_Storage from "./Utilities/SO_Storage";
import { getLocalStorage } from "../../Auth";
import { I_Storage } from "../../Interfaces";
import SO_CreateEditStorage from "./Utilities/SO_CreateEditStorage";

export default function SO_StorageComponent() {
  const [storages, setStorages] = useState<I_Storage[]>([]);

  const fetchStorages = async () => {
    try {
      const response = await fetch(
        "http://localhost:8080/api/warehouses/myFullWarehousesInformation",
        {
          method: "GET",
          headers: {
            Authorization: "Bearer " + getLocalStorage()?.token,
          },
        }
      );
      if (response.ok) {
        const storages: I_Storage[] = await response.json();
        setStorages(storages);
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
      <Stack gap={2}>
        <SO_CreateEditStorage fetchStorages={fetchStorages} isForEdit={false}/>
        {storages.map((storage) => (
          <SO_Storage
            key={storage.id}
            storage={storage}
            fetchStorages={fetchStorages}
          />
        ))}
      </Stack>
    </>
  );
}
