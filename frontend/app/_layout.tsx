import { Stack } from "expo-router"; // or your routing mechanism
import { Provider } from "react-redux";
import { store } from "../app/redux/store"; // adjust path as needed

export default function RootLayout() {
  return (
    <Provider store={store}>
      <Stack /> {/* This renders nested screens like RegisterScreen */}
    </Provider>
  );
}
