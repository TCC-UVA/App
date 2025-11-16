import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    position: "absolute",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    width: "auto",
    alignSelf: "center",
    bottom: 0,
    borderRadius: 40,
    paddingHorizontal: 8,
    paddingVertical: 10,
    gap: 4,
    overflow: "hidden",
  },
  tabItem: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: 40,
    paddingHorizontal: 12,
    borderRadius: 9999,
    gap: 8,
    overflow: "hidden",
  },
  text: {
    fontWeight: "600",
    marginBottom: 4,
    lineHeight: 24,
    color: "#FFFFFF",
  },
});
