import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Course } from '../../types';
import { mockCourses } from '../../services/mockData';

interface CoursesState {
  items: Course[];
}

const initialState: CoursesState = {
  items: mockCourses,
};

const coursesSlice = createSlice({
  name: 'courses',
  initialState,
  reducers: {
    addCourse(state, action: PayloadAction<Course>) {
      state.items.unshift(action.payload);
    },
    updateCourse(state, action: PayloadAction<Course>) {
      const idx = state.items.findIndex(c => c.id === action.payload.id);
      if (idx !== -1) state.items[idx] = action.payload;
    },
    removeCourse(state, action: PayloadAction<string>) {
      state.items = state.items.filter(c => c.id !== action.payload);
    },
  },
});

export const { addCourse, updateCourse, removeCourse } = coursesSlice.actions;
export default coursesSlice.reducer;
