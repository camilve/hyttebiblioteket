export type UserType = {
  id: string;
  uid: string;
  name: string;
  email: string;
};

export type PositionType = {
  latitude: number;
  longitude: number;
};

export type LocationError = {
  showError: boolean;
  message?: string;
};
