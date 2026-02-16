import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from './store';
import App from './App';

test('renders Pantry.io app', () => {
  render(
    <Provider store={store}>
      <App />
    </Provider>
  );
  const logoElement = screen.getByText(/Pantry.io/i);
  expect(logoElement).toBeInTheDocument();
});

test('renders navigation buttons', () => {
  render(
    <Provider store={store}>
      <App />
    </Provider>
  );
  const navButtons = screen.getAllByRole('button');
  expect(navButtons.length).toBeGreaterThanOrEqual(3);
  expect(screen.getByText(/My Pantry/i)).toBeInTheDocument();
  expect(screen.getByText(/Meal Planner/i)).toBeInTheDocument();
});
