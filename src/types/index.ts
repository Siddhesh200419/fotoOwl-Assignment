export interface User {
  fullName: string;
  email: string;
  gender: 'Male' | 'Female' | 'Other';
  mobileNumber: string;
  address: string;
  city: string;
  password?: string;
  avatarUrl?: string;
}

export interface PicsumImage {
  id: string;
  author: string;
  width: number;
  height: number;
  url: string;
  download_url: string;
}

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type MainTabsParamList = {
  Home: undefined;
  Favorites: undefined;
  Profile: undefined;
};

export type RootStackParamList = {
  AuthStack: undefined;
  MainTabs: undefined;
  ImageDetails: { image: PicsumImage };
};
