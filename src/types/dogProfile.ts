export interface DogProfile {
  id: string;
  name: string;
  breed: string;
  age: string;
  weight: string;
  image: string | null;
  userId?: string;
}
