export interface I_Storage {
  id: number;
  address: string;
  name: string;
  storageConditions: string;
  brandSpecialization: string;
  openingHours: string[];
  services: I_Service[];
  parkingSpaces: I_ParkingSpace[];
}

export interface I_Car {
  id: number;
  model: string;
  productionYear: string;
  brand: string;
  numberPlate: string;
  chassisNumber: string;
  maintenanceRecord: string;
  driveability: string;
  serviceEntities: []
}

export interface I_ParkingSpace {
  id: number;
  category: string;
  conditions: string;
  car: I_Car;
}

export interface I_Service {
  id: number;
  name: string;
  price: number;
  description: string;
}

export interface I_SpareAccessoryPart {
  id: number;
  designation: string; // Bezeichnung
  articleNumber: string;
  description: string;
  price: string;
  model: string;
  brand: string;
}

export interface I_Notification {
  id: number,
  date: string,
  status: string,
  history: string[],
  parkingSpaceID: number,
  clientID: number,
  storageOwnerID: number,
}

export interface WO_WorkshopRequest {
  id: number,
  date: string,
  status: string,
  history: string[],
  carID: number,
  workID: number,
  storageOwnerID: number,
  workShopID: number
}

export interface WO_DateNegotiation {
  id: number,
  date: string,
  status: string,
  history: string[],
  storageOwnerID: number,
  clientID: number,
}

export interface I_Workshop {
  id: number;
  address: string;
  brandSpecialization: string;
  openingHours: string[];
  work : I_Work[];
}

export interface I_Work {
  id: number;
  designation: string;
  price: number;
  description: string;
}