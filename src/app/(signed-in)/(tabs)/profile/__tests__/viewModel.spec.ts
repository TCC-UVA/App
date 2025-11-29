import { createWrapper } from "@/src/mock/provider";
import { useAuthStore } from "@/src/store/auth";
import { act, renderHook } from "@testing-library/react-native";
import { useProfileViewModel } from "../viewModel";

jest.mock("@/src/store/auth");

const sut = () =>
  renderHook(() => useProfileViewModel(), {
    wrapper: createWrapper(),
  });

describe("Profile - ViewModel", () => {
  const mockReset = jest.fn();
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
    (useAuthStore as unknown as jest.Mock).mockImplementation((selector) =>
      selector({ reset: mockReset })
    );
  });

  it("should toggle sign out sheet visibility", () => {
    const { result } = sut();
    expect(result.current.signOutSheetOpen).toBe(false);
    act(() => {
      result.current.handleToggleSignOutSheet();
    });
    expect(result.current.signOutSheetOpen).toBe(true);
    act(() => {
      result.current.handleToggleSignOutSheet();
    });
    expect(result.current.signOutSheetOpen).toBe(false);
  });

  it("should call reset on handleSignout", () => {
    const { result } = renderHook(() => useProfileViewModel());

    act(() => {
      result.current.handleSignout();
    });

    expect(mockReset).toHaveBeenCalledTimes(1);
  });
});
