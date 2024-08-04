import * as React from "react";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import UserAvatar from "../components/desks/UserAvatar";
import useUser from "../hooks/useUser";
import { getInitials } from "../utils/icons";

jest.mock("@/hooks/useUser");
const mockedUseUser = useUser as jest.MockedFunction<typeof useUser>;

jest.mock("@/utils/icons", () => ({
  getInitials: jest.fn(),
}));
const bookingUser = {
  zid: 1,
  email: "example@email.com",
  fullname: "Umar",
  title: "Mr",
  school: "school",
  faculty: "faculty",
  role: "role",
  usergrp: "hdr",
  image: "exampleImage",
};

describe("UserAvatar", () => {
  const mockSetUser = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders with default image when anonymous user", () => {
    mockedUseUser.mockReturnValue({ user: null, isLoading: false, error: null });

    render(<UserAvatar zid={1} selected={false} setUser={mockSetUser} />);

    expect(screen.getByRole("img")).toHaveAttribute("src", "/defaultUser.svg");
    expect(getInitials).toHaveBeenCalledWith("anonymous");
  });

  it("renders with user data", async () => {
    mockedUseUser.mockReturnValue({ user: bookingUser, isLoading: false, error: null });

    render(<UserAvatar zid={1} selected={false} setUser={mockSetUser} />);

    expect(screen.getByRole("img")).toHaveAttribute(
      "src",
      `data:image/jpeg;base64,${bookingUser.image}`,
    );
    expect(getInitials).toHaveBeenCalledWith(bookingUser.fullname);
  });
});
