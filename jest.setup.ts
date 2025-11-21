jest.mock("react-native/Libraries/Lists/FlatList", () => {
  const React = require("react");
  const { View } = require("react-native");

  return {
    __esModule: true,
    default: jest.fn(
      ({ data, renderItem, keyExtractor, ListEmptyComponent, testID }: any) => {
        if (!data || data.length === 0) {
          return React.createElement(
            View,
            { testID: testID || "flat-list-empty" },
            ListEmptyComponent ? React.createElement(ListEmptyComponent) : null
          );
        }

        return React.createElement(
          View,
          { testID: testID || "flat-list" },
          data.map((item: any, index: number) => {
            const key = keyExtractor ? keyExtractor(item, index) : index;
            return React.createElement(
              View,
              { key },
              renderItem({ item, index })
            );
          })
        );
      }
    ),
  };
});

jest.mock(
  "react-native/Libraries/Components/Keyboard/KeyboardAvoidingView",
  () => {
    const React = require("react");
    const { View } = require("react-native");

    return {
      __esModule: true,
      default: jest.fn(({ children, ...props }: any) =>
        React.createElement(View, props, children)
      ),
    };
  }
);
