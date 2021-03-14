import { render, screen, fireEvent } from "@testing-library/react";
import App from "./App";

test("Users name appears in login", () => {
  render(<App />);
  const linkElement = screen.getByText('Login');
  expect(linkElement).toBeInTheDocument();
  
});


test("Leaderboard is visible.",() => {
  render(<App />);
  const leadele = screen.getByText('Show/Hide Leaderboard');
    expect(leadele).toBeInTheDocument();

});

test("Square not visible",() =>{
  render(<App />);
  const board = screen.getByText("Click to restart game (warning, all users will need to refresh if they want to keep watching/playing)!")
  expect(board).toBeInTheDocument()
})