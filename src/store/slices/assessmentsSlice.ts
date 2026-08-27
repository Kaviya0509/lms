import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Assessment } from '../../types';
import { mockAssessments } from '../../services/mockData';

interface AssessmentsState {
  items: Assessment[];
}

const initialState: AssessmentsState = {
  items: mockAssessments,
};

const assessmentsSlice = createSlice({
  name: 'assessments',
  initialState,
  reducers: {
    addAssessment(state, action: PayloadAction<Assessment>) {
      state.items.unshift(action.payload);
    },
    updateAssessment(state, action: PayloadAction<Assessment>) {
      const idx = state.items.findIndex(a => a.id === action.payload.id);
      if (idx !== -1) state.items[idx] = action.payload;
    },
    removeAssessment(state, action: PayloadAction<string>) {
      state.items = state.items.filter(a => a.id !== action.payload);
    },
  },
});

export const { addAssessment, updateAssessment, removeAssessment } = assessmentsSlice.actions;
export default assessmentsSlice.reducer;
