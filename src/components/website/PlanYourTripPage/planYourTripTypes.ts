export type PlanStep = 1 | 2 | 3 | 4;

export type PlanDestination = {
  id: string | number;
  name: string;
  image: string;
};

export type TripData = {
  destinations: (string | number)[];
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
    tripCategory: string[];
    duration: string;
    budget: string;
    hotelCategory: string;
    roomType: string[];
    transportation: string;
    experiences: string[];
    activities: string[];
    contactMethod: string;
  };
};
