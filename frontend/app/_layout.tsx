import { Stack } from "expo-router";
import "./globals.css"; // Import global styles
export default function RootLayout() {
  return <Stack />;
}
// app/_layout.tsx or app/_app.tsx (depends on your setup)
// import { Slot } from "expo-router"; // or your routing mechanism
// import { Provider } from "react-redux";
// import { store } from "../app/redux/store"; // adjust path as needed

// export default function RootLayout() {
//   return (
//     <Provider store={store}>
//       <Slot /> {/* This renders nested screens like RegisterScreen */}
//     </Provider>
//   );
// }
