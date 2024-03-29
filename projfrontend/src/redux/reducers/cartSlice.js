const { createSlice } = require("@reduxjs/toolkit");

export const cartSlice = createSlice({
  name: "cart",
  initialState: {
    value: [],
  },
  reducers: {
    addToCart: (state, action) => {
      console.log("payload= ", action.payload);
      const index = state.value.findIndex(
        (item) => item._id === action.payload._id
      );
      if (index !== -1) {
        state.value[index].quantity += 1;
        return;
      }
      state.value.push({ ...action.payload, quantity: 1 });
      console.log("clicked");
    },

    removeFromCart: (state, action) => {
      state.value = state.value.filter(
        (product) => !(product._id === action.payload._id)
      );
    },

    decreaseQuantity: (state, action) => {
      if (action.payload.quantity === 1) {
        return;
      }

      const index = state.value.findIndex(
        (item) => item.id === action.payload.id
      );
      state.value[index].quantity -= 1;
    },
  },
});

export const { addToCart, removeFromCart, decreaseQuantity } =
  cartSlice.actions;

export default cartSlice.reducer;
