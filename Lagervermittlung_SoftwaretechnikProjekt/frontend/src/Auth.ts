export interface AuthData {
  token: string;
  firstName: string;
  lastName: string;
  userType: string;
}

export enum UserType {
  Client = 1,
  SpareAccessoryDealer = 2,
  StorageOwner = 3,
  WorkshopOwner = 4,
}

export const intToUserTypeString = (value: number): string | undefined => {
  switch (value) {
    case UserType.Client:
      return "c";
    case UserType.SpareAccessoryDealer:
      return "sad";
    case UserType.StorageOwner:
      return "so";
    case UserType.WorkshopOwner:
      return "wo";
    default:
      return undefined;
  }
};

export const setLocalStorage = (authData: AuthData) => {
  localStorage.setItem("authData", JSON.stringify(authData));
};

export const getLocalStorage = () => {
  const data = localStorage.getItem("authData");
  let authData: AuthData;
  if (data) authData = JSON.parse(data);
  else return null;

  return authData;
};

export const deleteLocalStorage = () => {
  localStorage.removeItem("authData");
};
