import { Stack } from "expo-router";
import Toast from "react-native-toast-message";
import { Provider } from "react-redux";
import { store } from "../src/redux/store";

export default function RootLayout() {
  return (
    <Provider store={store}>
      <>
        <Toast position="top" visibilityTime={3000} />
        <Stack /> {/* This renders nested screens like RegisterScreen */}
      </>
    </Provider>
  );
}
