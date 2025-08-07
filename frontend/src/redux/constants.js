const getBaseUrl = () => {
  if (process.env.MONGO_URI) {
    return process.env.MONGO_URI;
  }

  if (__DEV__) {
    return "http://localhost:5000";
  }

  return "https://prod-api";
};

export const BASE_URL = getBaseUrl();
export const USERS_URL = `${BASE_URL}/api/users`;
export const SERVICES_URL = `${BASE_URL}/api/services`;
export const BOOKINGS_URL = `${BASE_URL}/api/bookings`;
export const BUSINESS_HOURS_URL = `${BASE_URL}/api/business-hours`;
