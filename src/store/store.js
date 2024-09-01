import { configureStore } from "@reduxjs/toolkit";
import giftCardReducer from "./reducers/counter";

export default configureStore({
  reducer: {
    giftCard: giftCardReducer,
  },
});
