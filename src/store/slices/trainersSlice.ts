import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Trainer } from '../../types';
import { mockTrainers } from '../../services/mockData';

interface TrainersState {
  items: Trainer[];
}

const initialState: TrainersState = {
  items: mockTrainers,
};

const trainersSlice = createSlice({
  name: 'trainers',
  initialState,
  reducers: {
    addTrainer(state, action: PayloadAction<Trainer>) {
      state.items.unshift(action.payload);
    },
    updateTrainer(state, action: PayloadAction<Trainer>) {
      const idx = state.items.findIndex(t => t.id === action.payload.id);
      if (idx !== -1) state.items[idx] = action.payload;
    },
    removeTrainer(state, action: PayloadAction<string>) {
      state.items = state.items.filter(t => t.id !== action.payload);
    },
    toggleTrainerStatus(state, action: PayloadAction<string>) {
      const t = state.items.find(t => t.id === action.payload);
      if (t) t.status = t.status === 'active' ? 'inactive' : 'active';
    },
  },
});

export const { addTrainer, updateTrainer, removeTrainer, toggleTrainerStatus } = trainersSlice.actions;
export default trainersSlice.reducer;
