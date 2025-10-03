export {
  bookingService,
  type Booking,
  type BookingFilters,
  type CreateBookingData,
} from "./services/bookingService";
export {
  businessHoursService,
  type BusinessHours,
  type CreateBusinessHoursData,
} from "./services/businessHoursService";
export {
  clientService,
  type LoginCredentials,
  type RegisterData,
  type User,
} from "./services/clientService";
export {
  serviceService,
  type CreateServiceData,
  type Service,
} from "./services/serviceService";

export { auth, db } from "./config/firebase_config";
