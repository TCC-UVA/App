import { Redirect } from "expo-router";
import { useAuthStore } from "../store/auth";

export default function Index() {
  const token = useAuthStore((state) => state.token);

  if (token) {
    return <Redirect href={"/(signed-in)/(tabs)/home"} />;
  }

  return <Redirect href={"/(signed-off)/onboarding"} />;
}
