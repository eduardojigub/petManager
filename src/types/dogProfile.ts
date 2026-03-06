export interface DogProfile {
  id: string;
  name: string;
  breed: string;
  age: string;
  weight: string;
  image: string | null;
  userId?: string;
  birthday?: string;
  gender?: string;
  color?: string;
  microchip?: string;
}
