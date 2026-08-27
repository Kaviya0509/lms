export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'instructor' | 'student';
  status: 'active' | 'inactive' | 'suspended';
  joinedAt: string;
  coursesEnrolled: number;
}

export interface Course {
  id: string;
  title: string;
  instructor: string;
  category: string;
  status: 'published' | 'draft' | 'archived';
  studentsCount: number;
  price: number;
  rating: number;
  createdAt: string;
  duration: string;
}

export interface Enrollment {
  id: string;
  studentName: string;
  courseName: string;
  enrolledAt: string;
  progress: number;
  status: 'active' | 'completed' | 'dropped';
}

export interface DashboardStats {
  totalUsers: number;
  totalCourses: number;
  totalRevenue: number;
  activeEnrollments: number;
  userGrowth: number;
  revenueGrowth: number;
  courseGrowth: number;
  enrollmentGrowth: number;
}

export const mockStats: DashboardStats = {
  totalUsers: 12847,
  totalCourses: 384,
  totalRevenue: 284750,
  activeEnrollments: 9432,
  userGrowth: 12.4,
  revenueGrowth: 8.7,
  courseGrowth: 5.2,
  enrollmentGrowth: 15.3,
};

export const mockUsers: User[] = [
  { id: '1', name: 'Aarav Sharma', email: 'aarav@example.com', role: 'student', status: 'active', joinedAt: '2024-01-15', coursesEnrolled: 4 },
  { id: '2', name: 'Priya Nair', email: 'priya@example.com', role: 'instructor', status: 'active', joinedAt: '2023-08-20', coursesEnrolled: 0 },
  { id: '3', name: 'Rahul Verma', email: 'rahul@example.com', role: 'student', status: 'inactive', joinedAt: '2024-03-10', coursesEnrolled: 2 },
  { id: '4', name: 'Sneha Pillai', email: 'sneha@example.com', role: 'student', status: 'active', joinedAt: '2024-05-22', coursesEnrolled: 7 },
  { id: '5', name: 'Vikram Das', email: 'vikram@example.com', role: 'instructor', status: 'suspended', joinedAt: '2023-11-01', coursesEnrolled: 0 },
  { id: '6', name: 'Ananya Reddy', email: 'ananya@example.com', role: 'student', status: 'active', joinedAt: '2024-06-18', coursesEnrolled: 3 },
  { id: '7', name: 'Kiran Mehta', email: 'kiran@example.com', role: 'admin', status: 'active', joinedAt: '2023-01-05', coursesEnrolled: 0 },
  { id: '8', name: 'Divya Krishnan', email: 'divya@example.com', role: 'student', status: 'active', joinedAt: '2024-07-30', coursesEnrolled: 5 },
];

export const mockCourses: Course[] = [
  { id: '1', title: 'React & TypeScript Masterclass', instructor: 'Priya Nair', category: 'Web Development', status: 'published', studentsCount: 1240, price: 4999, rating: 4.8, createdAt: '2024-01-10', duration: '42h 30m' },
  { id: '2', title: 'Machine Learning Fundamentals', instructor: 'Vikram Das', category: 'Data Science', status: 'published', studentsCount: 890, price: 5999, rating: 4.6, createdAt: '2024-02-14', duration: '38h 15m' },
  { id: '3', title: 'UI/UX Design Bootcamp', instructor: 'Priya Nair', category: 'Design', status: 'draft', studentsCount: 0, price: 3499, rating: 0, createdAt: '2024-07-01', duration: '28h 00m' },
  { id: '4', title: 'Node.js Backend Development', instructor: 'Kiran Mehta', category: 'Backend', status: 'published', studentsCount: 645, price: 4499, rating: 4.7, createdAt: '2024-03-22', duration: '35h 20m' },
  { id: '5', title: 'AWS Cloud Practitioner', instructor: 'Rahul Verma', category: 'Cloud', status: 'archived', studentsCount: 320, price: 6999, rating: 4.5, createdAt: '2023-10-15', duration: '24h 45m' },
  { id: '6', title: 'Python for Data Analysis', instructor: 'Vikram Das', category: 'Data Science', status: 'published', studentsCount: 1105, price: 3999, rating: 4.9, createdAt: '2024-04-08', duration: '30h 10m' },
];

export const mockEnrollments: Enrollment[] = [
  { id: '1', studentName: 'Aarav Sharma', courseName: 'React & TypeScript Masterclass', enrolledAt: '2024-08-01', progress: 72, status: 'active' },
  { id: '2', studentName: 'Sneha Pillai', courseName: 'Machine Learning Fundamentals', enrolledAt: '2024-07-15', progress: 100, status: 'completed' },
  { id: '3', studentName: 'Divya Krishnan', courseName: 'Node.js Backend Development', enrolledAt: '2024-08-10', progress: 35, status: 'active' },
  { id: '4', studentName: 'Rahul Verma', courseName: 'Python for Data Analysis', enrolledAt: '2024-06-28', progress: 15, status: 'dropped' },
  { id: '5', studentName: 'Ananya Reddy', courseName: 'React & TypeScript Masterclass', enrolledAt: '2024-08-20', progress: 10, status: 'active' },
  { id: '6', studentName: 'Aarav Sharma', courseName: 'AWS Cloud Practitioner', enrolledAt: '2024-05-05', progress: 100, status: 'completed' },
];

export const revenueData = {
  series: [{ name: 'Revenue (₹)', data: [182000, 210000, 198000, 234000, 259000, 284750] }],
  categories: ['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
};

export const enrollmentData = {
  series: [{ name: 'Enrollments', data: [620, 780, 710, 920, 1050, 1180] }],
  categories: ['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
};
