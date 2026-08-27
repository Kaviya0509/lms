import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Batch } from '../../types';
import { mockBatches } from '../../services/mockData';

interface BatchesState {
  items: Batch[];
}

const initialState: BatchesState = {
  items: mockBatches,
};

const batchesSlice = createSlice({
  name: 'batches',
  initialState,
  reducers: {
    addBatch(state, action: PayloadAction<Batch>) {
      state.items.unshift(action.payload);
    },
    updateBatch(state, action: PayloadAction<Batch>) {
      const idx = state.items.findIndex(b => b.id === action.payload.id);
      if (idx !== -1) state.items[idx] = action.payload;
    },
    removeBatch(state, action: PayloadAction<string>) {
      state.items = state.items.filter(b => b.id !== action.payload);
    },
  },
});

export const { addBatch, updateBatch, removeBatch } = batchesSlice.actions;
export default batchesSlice.reducer;
