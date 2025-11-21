import { useAuthStore } from "@/src/store/auth";
import { useState } from "react";

export const useProfileViewModel = () => {
  const logout = useAuthStore((state) => state.reset);
  const [signOutSheetOpen, setSignOutSheetOpen] = useState(false);
  const handleSignout = () => {
    logout();
  };
  const handleToggleSignOutSheet = () => {
    setSignOutSheetOpen((prev) => !prev);
  };
  return { handleSignout, handleToggleSignOutSheet, signOutSheetOpen };
};
