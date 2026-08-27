import type { ReactNode } from 'react';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'trainer' | 'trainee';
  avatar?: string;
}

export interface LoginCredentials { email: string; password: string; }
export interface AuthState { user: AuthUser | null; token: string | null; isAuthenticated: boolean; loading: boolean; }

export interface Trainer {
  id: string;
  name: string;
  email: string;
  mobile: string;
  qualification: string;
  expertise: string[];
  experience: number;
  certifications: string[];
  bio: string;
  availability: 'full-time' | 'part-time' | 'contract';
  status: 'active' | 'inactive';
  assignedCourses: string[];
  avatar?: string;
  joinedAt: string;
  totalBatches: number;
  rating: number;
}

export interface Trainee {
  id: string;
  name: string;
  email: string;
  mobile: string;
  type: 'fresher' | 'professional';
  company?: string;
  experience?: number;
  location: string;
  status: 'active' | 'inactive' | 'pending';
  enrolledCourses: string[];
  assignedBatch?: string;
  overallProgress: number;
  attendancePercentage: number;
  joinedAt: string;
  avatar?: string;
}

export type CourseMode = 'online' | 'offline' | 'both';
export type CourseStatus = 'draft' | 'configuration' | 'review' | 'published' | 'archived';
export type CourseLevel = 'beginner' | 'intermediate' | 'advanced';

export interface CourseModule {
  id: string;
  title: string;
  order: number;
  lessons: CourseLession[];
}
export interface CourseLession {
  id: string;
  title: string;
  type: 'video' | 'text' | 'quiz';
  duration: number;
  content?: string;
}

export interface Course {
  id: string;
  name: string;
  code: string;
  description: string;
  category: string;
  categoryId: string;
  level: CourseLevel;
  duration: number;
  mode: CourseMode;
  status: CourseStatus;
  objectives: string[];
  prerequisites: string[];
  skills: string[];
  trainerId?: string;
  trainerName?: string;
  hasAssessment: boolean;
  hasCertificate: boolean;
  modules?: CourseModule[];
  batchId?: string;
  locationId?: string;
  startDate?: string;
  endDate?: string;
  seatCapacity?: number;
  enrolledCount: number;
  completedCount: number;
  rating: number;
  createdAt: string;
  updatedAt: string;
  thumbnail?: string;
}

export interface Batch {
  id: string;
  name: string;
  courseId: string;
  courseName: string;
  trainerId: string;
  trainerName: string;
  locationId?: string;
  locationName?: string;
  startDate: string;
  endDate: string;
  seatCapacity: number;
  enrolledCount: number;
  status: 'upcoming' | 'active' | 'completed' | 'cancelled';
  attendanceRequired: number;
  sessions: BatchSession[];
}

export interface BatchSession {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  topic: string;
  status: 'scheduled' | 'completed' | 'cancelled';
}

export interface Location {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  buildings: Building[];
}
export interface Building {
  id: string;
  name: string;
  rooms: Room[];
}
export interface Room {
  id: string;
  name: string;
  capacity: number;
  facilities: string[];
}

export type EnrollmentStatus = 'pending' | 'approved' | 'rejected' | 'completed' | 'dropped';

export interface Enrollment {
  id: string;
  traineeId: string;
  traineeName: string;
  traineeEmail: string;
  courseId: string;
  courseName: string;
  courseMode: CourseMode;
  batchId?: string;
  batchName?: string;
  enrolledAt: string;
  status: EnrollmentStatus;
  progress: number;
  approvedAt?: string;
  approvedBy?: string;
  reason?: string;
}

export interface AttendanceRecord {
  id: string;
  traineeId: string;
  traineeName: string;
  batchId: string;
  batchName: string;
  sessionId: string;
  sessionDate: string;
  status: 'present' | 'absent' | 'late';
  percentage: number;
  required: number;
  flagged: boolean;
}

export interface Assessment {
  id: string;
  title: string;
  courseId: string;
  courseName: string;
  type: 'quiz' | 'final' | 'assignment';
  totalQuestions: number;
  passingScore: number;
  maxAttempts: number;
  duration: number;
  status: 'active' | 'inactive';
  createdAt: string;
}

export interface AssessmentResult {
  id: string;
  assessmentId: string;
  traineeId: string;
  traineeName: string;
  score: number;
  passed: boolean;
  attempt: number;
  completedAt: string;
}

export interface Certificate {
  id: string;
  courseId: string;
  courseName: string;
  traineeId: string;
  traineeName: string;
  issuedAt: string;
  status: 'issued' | 'pending' | 'revoked';
  verificationCode: string;
  minScore: number;
  minAttendance: number;
}

export interface ReportFilter {
  type: 'enrollment' | 'attendance' | 'assessment' | 'trainer' | 'certificate' | 'course';
  dateFrom?: string;
  dateTo?: string;
  courseId?: string;
  batchId?: string;
  trainerId?: string;
}

export interface DashboardStats {
  totalTrainers: number;
  totalTrainees: number;
  totalCourses: number;
  onlineCourses: number;
  offlineCourses: number;
  activeBatches: number;
  completedCourses: number;
  upcomingSessions: number;
  pendingAssessments: number;
  certificatesIssued: number;
  pendingEnrollments: number;
  activeEnrollments: number;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  coursesCount: number;
  status: 'active' | 'inactive';
}

export interface NavGroup { label: string; items: NavItem[]; }
export interface NavItem { id: string; label: string; path: string; icon: React.ComponentType<{ size?: number; className?: string }>; badge?: number; children?: NavItem[]; }
export interface BreadcrumbItem { label: string; path?: string; }
export interface ToastMessage { id: string; type: 'success' | 'error' | 'warning' | 'info'; message: string; duration?: number; }
export interface TableColumn<T> { key: keyof T | string; label: string; sortable?: boolean; render?: (value: unknown, row: T) => ReactNode; className?: string; filterable?: boolean; filterOptions?: { value: string; label: string }[]; }
export interface PaginationState { page: number; limit: number; total: number; }
export interface ApiResponse<T> { data: T; message: string; success: boolean; pagination?: PaginationState; }
