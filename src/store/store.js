import { configureStore } from '@reduxjs/toolkit';
import counter from './reducers/counter';

export default configureStore({
  reducer: {
    counter: counter,
  },
});