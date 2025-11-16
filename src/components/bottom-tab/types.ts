import { EdgeInsets } from "react-native-safe-area-context";

export type TabBarProps = {
  state: {
    index: number;
    routes: {
      key: string;
      name: string;
      params?: Record<string, any>;
    }[];
  };
  descriptors: {
    [key: string]: {
      options: {
        tabBarLabel?:
          | string
          | ((props: {
              focused: boolean;
              color: string;
              position: any;
            }) => React.ReactNode);
        title?: string;
        tabBarIcon?: (props: {
          focused: boolean;
          color: string;
          size: number;
        }) => React.ReactNode;
        tabBarVisible?: boolean;
        [key: string]: any;
      };
      navigation: {
        navigate: (name: string) => void;
        emit: (event: {
          type: string;
          target: string;
          canPreventDefault: boolean;
        }) => { defaultPrevented: boolean };
      };
      render?: () => React.ReactNode;
    };
  };
  navigation: {
    navigate: (name: string, params: any) => void;
    emit: (event: {
      type: string;
      target: string;
      canPreventDefault: boolean;
    }) => { defaultPrevented: boolean };
  };
  insets: EdgeInsets;
};
