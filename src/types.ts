export interface Review {
  id: string;
  propertyId: string;
  userName: string;
  rating: number; // 1-5
  comment: string;
  date: string;
}

export interface Property {
  id: string;
  name: string;
  location: string;
  price: number;
  type: string;
  image: string;
  images: string[];
  description: string;
  status: 'available' | 'reserved' | 'sold';
  progress: number;
  features: string[];
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface ConstructionLog {
  id: string;
  projectId: string;
  date: string;
  description: string;
  imageUrl: string;
  percentage: number;
}

export type ShariaAkad = 'Murabahah' | 'MMq' | 'IMBT';

export interface CalculationResult {
  monthlyInstallment: number;
  totalPayment: number;
  totalMargin: number;
  tenorMonths: number;
}
