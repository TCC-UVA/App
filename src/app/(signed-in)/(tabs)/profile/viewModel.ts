import { useAuthStore } from "@/src/store/auth";
import { useRouter } from "expo-router";
import { useState } from "react";

export const useProfileViewModel = () => {
  const router = useRouter();
  const logout = useAuthStore((state) => state.reset);
  const [signOutSheetOpen, setSignOutSheetOpen] = useState(false);
  const handleSignout = () => {
    logout();
    router.replace("/(signed-off)/login");
  };
  const handleToggleSignOutSheet = () => {
    setSignOutSheetOpen((prev) => !prev);
  };
  return { handleSignout, handleToggleSignOutSheet, signOutSheetOpen };
};
