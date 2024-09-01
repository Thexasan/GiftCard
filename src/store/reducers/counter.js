import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  giftCard: {
    sentTime: false,
  },
};
export const giftCardSlice = createSlice({
  name: "giftCard",
  initialState,
  reducers: {},
});

export const {} = giftCardSlice.actions;

export default giftCardSlice.reducer;
