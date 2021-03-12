import { render, screen, fireEvent } from "@testing-library/react";
import App from "./App";

test("Users name appears in login", () => {
  render(<App />);
  const linkElement = screen.getByText('Login');
  expect(linkElement).toBeInTheDocument();
});
