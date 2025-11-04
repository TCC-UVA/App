import Reactotron from "reactotron-react-native";

Reactotron.configure({
  name: "React Native Demo",
})
  .useReactNative({
    networking: true,
    errors: true,
    log: true,
    asyncStorage: true,
  })
  .connect();