import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import uiReducer from './slices/uiSlice';
import coursesReducer from './slices/coursesSlice';
import trainersReducer from './slices/trainersSlice';
import traineesReducer from './slices/traineesSlice';
import batchesReducer from './slices/batchesSlice';
import locationsReducer from './slices/locationsSlice';
import assessmentsReducer from './slices/assessmentsSlice';
import notificationsReducer from './slices/notificationsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
    courses: coursesReducer,
    trainers: trainersReducer,
    trainees: traineesReducer,
    batches: batchesReducer,
    locations: locationsReducer,
    assessments: assessmentsReducer,
    notifications: notificationsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
