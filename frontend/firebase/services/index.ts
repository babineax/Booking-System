export {
  bookingService,
  type Booking,
  type BookingFilters,
  type CreateBookingData,
} from "./bookingService";
export {
  businessHoursService,
  type BusinessHours,
  type CreateBusinessHoursData,
} from "./businessHoursService";
export {
  clientService,
  type LoginCredentials,
  type RegisterData,
  type User,
} from "./clientService";
export {
  googleCalendarService,
  type CalendarCredentials,
} from "./googleCalendarService";
export {
  serviceService,
  type CreateServiceData,
  type Service,
} from "./serviceService";

export { auth, db } from "../config";
