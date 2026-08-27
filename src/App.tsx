import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import ProtectedRoute from './routes/ProtectedRoute';

import LoginPage from './pages/auth/LoginPage';

import DashboardPage from './pages/dashboard/DashboardPage';

import TrainerListPage from './pages/trainers/TrainerListPage';
import TrainerFormPage from './pages/trainers/TrainerFormPage';
import TraineeListPage from './pages/trainees/TraineeListPage';
import TraineeFormPage from './pages/trainees/TraineeFormPage';

import CourseListPage from './pages/courses/CourseListPage';
import CourseCreatePage from './pages/courses/CourseCreatePage';

import BatchListPage from './pages/batches/BatchListPage';
import BatchFormPage from './pages/batches/BatchFormPage';
import LocationListPage from './pages/locations/LocationListPage';
import LocationFormPage from './pages/locations/LocationFormPage';

import EnrollmentListPage from './pages/enrollments/EnrollmentListPage';
import AttendancePage from './pages/attendance/AttendancePage';
import AssessmentListPage from './pages/assessments/AssessmentListPage';
import AssessmentFormPage from './pages/assessments/AssessmentFormPage';
import CertificateListPage from './pages/certificates/CertificateListPage';
import ReportsPage from './pages/reports/ReportsPage';
import SettingsPage from './pages/settings/SettingsPage';
import CategoryFormPage from './pages/settings/CategoryFormPage';
import ProfilePage from './pages/profile/ProfilePage';
import NotificationsPage from './pages/notifications/NotificationsPage';

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/" element={<DashboardPage />} />

          <Route path="/trainers" element={<TrainerListPage />} />
          <Route path="/trainers/add" element={<TrainerFormPage />} />
          <Route path="/trainers/edit/:id" element={<TrainerFormPage />} />
          <Route path="/trainees" element={<TraineeListPage />} />
          <Route path="/trainees/add" element={<TraineeFormPage />} />
          <Route path="/trainees/edit/:id" element={<TraineeFormPage />} />

          <Route path="/courses" element={<CourseListPage key="all" />} />
          <Route path="/courses/online" element={<CourseListPage key="online" initialMode="online" />} />
          <Route path="/courses/offline" element={<CourseListPage key="offline" initialMode="offline" />} />
          <Route path="/courses/create" element={<CourseCreatePage />} />
          <Route path="/courses/edit/:id" element={<CourseCreatePage />} />

          <Route path="/batches" element={<BatchListPage />} />
          <Route path="/batches/add" element={<BatchFormPage />} />
          <Route path="/batches/edit/:id" element={<BatchFormPage />} />
          <Route path="/locations" element={<LocationListPage />} />
          <Route path="/locations/add" element={<LocationFormPage />} />
          <Route path="/locations/edit/:id" element={<LocationFormPage />} />

          <Route path="/enrollments" element={<EnrollmentListPage />} />
          <Route path="/attendance" element={<AttendancePage />} />
          <Route path="/assessments" element={<AssessmentListPage />} />
          <Route path="/assessments/add" element={<AssessmentFormPage />} />
          <Route path="/assessments/edit/:id" element={<AssessmentFormPage />} />
          <Route path="/certificates" element={<CertificateListPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/settings/categories/add" element={<CategoryFormPage />} />
          <Route path="/settings/categories/edit/:id" element={<CategoryFormPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
