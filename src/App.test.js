import { render, screen } from '@testing-library/react';
import App from './App';

test('renders tournament title', () => {
  render(<App />);
  const titleElement = screen.getByText(/TOURNOI OFFICIEL/i);
  expect(titleElement).toBeInTheDocument();
});
