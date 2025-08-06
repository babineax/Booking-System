
const getBaseUrl = () => {
  
  if (process.env.EXPO_PUBLIC_API_BASE_URL) {
    return process.env.EXPO_PUBLIC_API_BASE_URL;
  }
  
  
  if (__DEV__) {
    return "http://localhost:3001";
  }
  
  // For prod not sure we need it for now but f*ck it
  return "https://your-production-api.com";
};

export const BASE_URL = getBaseUrl();
export const USERS_URL = `${BASE_URL}/api/users`;
export const SERVICES_URL = `${BASE_URL}/api/services`;
export const BOOKINGS_URL = `${BASE_URL}/api/bookings`;
export const BUSINESS_HOURS_URL = `${BASE_URL}/api/business-hours`;
