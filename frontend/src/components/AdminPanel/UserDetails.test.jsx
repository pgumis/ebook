import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import UserDetails from './UserDetails';

const userDataReducer = (state = { token: 'test-token' }) => state;
const viewReducer = (state = { selectedItemId: 1 }) => state;

const store = configureStore({
  reducer: {
    userData: userDataReducer,
    view: viewReducer,
  },
});

beforeEach(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({
        id: 1,
        imie: 'Jan',
        nazwisko: 'Kowalski',
        email: 'jan.kowalski@example.com',
        numer_telefonu: '123456789',
        rola: 'admin',
        status: 'aktywny',
        created_at: '2024-01-01T12:00:00Z',
      }),
    })
  );
});

afterEach(() => {
  jest.resetAllMocks();
});

test('wyświetla dane użytkownika po fetchu', async () => {
  render(
    <Provider store={store}>
      <UserDetails />
    </Provider>
  );

  expect(screen.getByText(/ładowanie/i)).toBeInTheDocument();

  await waitFor(() => {
    expect(screen.getByText(/Dane użytkownika:/)).toBeInTheDocument();
    expect(screen.getAllByText(/Jan/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Kowalski/).length).toBeGreaterThan(0);
    expect(screen.getByText(/jan.kowalski@example.com/)).toBeInTheDocument();
    expect(screen.getByText(/123456789/)).toBeInTheDocument();
    expect(screen.getByText(/admin/)).toBeInTheDocument();
    expect(screen.getByText(/aktywny/)).toBeInTheDocument();
  });

  expect(global.fetch).toHaveBeenCalled();
});