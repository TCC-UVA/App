import { act, fireEvent, render } from "@testing-library/react-native";
import { WrapperUi } from "../../../../../mock/provider";
import { ProfileView } from "../view";
import { useProfileViewModel } from "../viewModel";

jest.mock("expo-router", () => ({
  useRouter: jest.fn(),
  Link: ({ children }: any) => children,
}));

jest.mock("@expo/vector-icons", () => {
  const React = require("react");
  const { Text } = require("react-native");
  return {
    Ionicons: (props: any) => React.createElement(Text, props, props.name),
  };
});

const mockedHandleToggleSignOutSheet = jest.fn();
const mockedHandleSignout = jest.fn();

const sut = (customProps?: Partial<ReturnType<typeof useProfileViewModel>>) => {
  const methods = {
    handleSignout: mockedHandleSignout,
    handleToggleSignOutSheet: mockedHandleToggleSignOutSheet,
    signOutSheetOpen: false,
    ...customProps,
  } as ReturnType<typeof useProfileViewModel>;
  return render(
    <WrapperUi>
      <ProfileView {...methods} />
    </WrapperUi>
  );
};

describe("Profile - View", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
  });

  it("Should render logout button", () => {
    const { getByTestId } = sut();
    const logoutButton = getByTestId("logout-button");
    expect(logoutButton).toBeTruthy();
  });

  it("Should call handleToggleSignOutSheet when logout button is pressed", () => {
    const { getByTestId } = sut();
    const logoutButton = getByTestId("logout-button");

    act(() => {
      fireEvent.press(logoutButton);
    });

    expect(mockedHandleToggleSignOutSheet).toHaveBeenCalledTimes(1);
  });

  it("Should render ConfirmActionSheet when signOutSheetOpen is true", () => {
    const { getByText } = sut({ signOutSheetOpen: true });
    const title = getByText("Deseja realmente sair da sua conta?");
    const sairButton = getByText("Sair");
    const cancelarButton = getByText("Cancelar");

    expect(title).toBeTruthy();
    expect(sairButton).toBeTruthy();
    expect(cancelarButton).toBeTruthy();
  });

  it("Should not render ConfirmActionSheet when signOutSheetOpen is false", () => {
    const { queryByText } = sut({ signOutSheetOpen: false });
    const title = queryByText("Deseja realmente sair da sua conta?");
    const sairButton = queryByText("Sair");
    const cancelarButton = queryByText("Cancelar");

    expect(title).toBeNull();
    expect(sairButton).toBeNull();
    expect(cancelarButton).toBeNull();
  });

  it("Should call handleSignout when 'Sair' button is pressed", () => {
    const { getByText } = sut({ signOutSheetOpen: true });
    const sairButton = getByText("Sair");

    act(() => {
      fireEvent.press(sairButton);
    });

    expect(mockedHandleSignout).toHaveBeenCalledTimes(1);
  });

  it("Should call handleToggleSignOutSheet when 'Cancelar' button is pressed", () => {
    const { getByText } = sut({ signOutSheetOpen: true });
    const cancelarButton = getByText("Cancelar");

    act(() => {
      fireEvent.press(cancelarButton);
    });

    expect(mockedHandleToggleSignOutSheet).toHaveBeenCalledTimes(1);
  });
});
