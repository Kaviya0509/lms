import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Trainee } from '../../types';
import { mockTrainees } from '../../services/mockData';

interface TraineesState {
  items: Trainee[];
}

const initialState: TraineesState = {
  items: mockTrainees,
};

const traineesSlice = createSlice({
  name: 'trainees',
  initialState,
  reducers: {
    addTrainee(state, action: PayloadAction<Trainee>) {
      state.items.unshift(action.payload);
    },
    updateTrainee(state, action: PayloadAction<Trainee>) {
      const idx = state.items.findIndex(t => t.id === action.payload.id);
      if (idx !== -1) state.items[idx] = action.payload;
    },
    removeTrainee(state, action: PayloadAction<string>) {
      state.items = state.items.filter(t => t.id !== action.payload);
    },
    approveTraineeStatus(state, action: PayloadAction<string>) {
      const t = state.items.find(t => t.id === action.payload);
      if (t) t.status = 'active';
    },
  },
});

export const { addTrainee, updateTrainee, removeTrainee, approveTraineeStatus } = traineesSlice.actions;
export default traineesSlice.reducer;
