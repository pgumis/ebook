// src/store/cart.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Thunk do pobierania koszyka
export const fetchCartData = createAsyncThunk('cart/fetchData', async (token, { rejectWithValue }) => {
  try {
    const response = await fetch("http://localhost:8000/api/koszyk", {
      headers: { "Authorization": `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Błąd serwera.');
    const data = await response.json();
    // Przetwarzamy dane do właściwego formatu
    const items = data.pozycje.map(p => ({
      id: p.ebook.id,
      title: p.ebook.tytul,
      author: p.ebook.autor,
      price: parseFloat(p.ebook.cena_promocyjna ?? p.ebook.cena),
      okladka: p.ebook.okladka,
      format: p.ebook.format,
      quantity: p.ilosc,
    }));
    return { items, totalAmount: data.suma };
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

// Thunk do dodawania do koszyka
export const addItemToCart = createAsyncThunk('cart/addItem', async ({ token, bookData }, { rejectWithValue }) => {
  try {
    const response = await fetch("http://localhost:8000/api/koszyk", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ ebook_id: bookData.id }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.komunikat || 'Nie udało się dodać produktu.');
    }
    // Zwracamy dane książki, aby zaktualizować stan
    return bookData;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

// Thunk do usuwania z koszyka
export const removeItemFromCart = createAsyncThunk('cart/removeItem', async ({ token, itemId }, { rejectWithValue }) => {
  try {
    const response = await fetch(`http://localhost:8000/api/koszyk/${itemId}`, {
      method: 'DELETE',
      headers: { "Authorization": `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Nie udało się usunąć przedmiotu.');
    return itemId;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    totalAmount: 0,
    status: 'idle',
    error: null,
  },
  reducers: {
    clearCart(state) {
      state.items = [];
      state.totalAmount = 0;
      state.status = 'idle';
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
        // Fetch
        .addCase(fetchCartData.pending, (state) => { state.status = 'loading'; })
        .addCase(fetchCartData.fulfilled, (state, action) => {
          state.status = 'succeeded';
          state.items = action.payload.items;
          state.totalAmount = action.payload.totalAmount;
        })
        // Add
        .addCase(addItemToCart.fulfilled, (state, action) => {
          const newItem = action.payload;
          const existingItem = state.items.find((item) => item.id === newItem.id);
          if (!existingItem) {
            const price = parseFloat(newItem.price);
            state.items.push({ ...newItem, price, quantity: 1 });
            state.totalAmount += price;
          }
        })
        .addCase(addItemToCart.rejected, (state, action) => {
          // Możesz tu obsłużyć błąd, np. wyświetlić powiadomienie
          console.error("Błąd dodawania do koszyka:", action.payload);
        })
        // Remove
        .addCase(removeItemFromCart.fulfilled, (state, action) => {
          const removedItemId = action.payload;
          const removedItem = state.items.find(item => item.id === removedItemId);
          if (removedItem) {
            state.totalAmount -= removedItem.price * removedItem.quantity;
          }
          state.items = state.items.filter((item) => item.id !== removedItemId);
        });
  },
});

export const { clearCart } = cartSlice.actions; // Poprawiony export
export const cartActions = {
  clearCart,
  fetchCartData,
  addItemToCart,
  removeItemFromCart,
};
export default cartSlice.reducer;