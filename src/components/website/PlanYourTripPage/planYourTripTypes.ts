export type PlanStep = 1 | 2 | 3;

export type PlanDestination = {
  id: string;
  name: string;
  image: string;
};

export type TripData = {
  destinations: string[];
  travelerInfo: {
    name: string;
    email: string;
    phone: string;
    nationality: string;
    startDate: string;
    endDate: string;
    adults: number;
    children: number;
    infants: number;
    tripDetails: string;
  };
  preferences: {
    hotelCategory: number;
    roomType: string;
    transportation: string[];
    experiences: string[];
  };
};
