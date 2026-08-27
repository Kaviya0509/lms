import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Location } from '../../types';
import { mockLocations } from '../../services/mockData';

interface LocationsState {
  items: Location[];
}

const initialState: LocationsState = {
  items: mockLocations,
};

const locationsSlice = createSlice({
  name: 'locations',
  initialState,
  reducers: {
    addLocation(state, action: PayloadAction<Location>) {
      state.items.unshift(action.payload);
    },
    updateLocation(state, action: PayloadAction<Location>) {
      const idx = state.items.findIndex(l => l.id === action.payload.id);
      if (idx !== -1) state.items[idx] = action.payload;
    },
    removeLocation(state, action: PayloadAction<string>) {
      state.items = state.items.filter(l => l.id !== action.payload);
    },
  },
});

export const { addLocation, updateLocation, removeLocation } = locationsSlice.actions;
export default locationsSlice.reducer;
