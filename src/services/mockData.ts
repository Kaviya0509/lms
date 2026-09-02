import type {
  DashboardStats, Trainer, Trainee, Course, Batch, Enrollment,
  AttendanceRecord, TrainerAttendanceRecord, Assessment, Certificate, Location, Category
} from '../types';

export const mockDashboardStats: DashboardStats = {
  totalTrainers: 48, totalTrainees: 1284, totalCourses: 4,
  onlineCourses: 4, offlineCourses: 4, activeBatches: 8,
  completedCourses: 0, upcomingSessions: 4, pendingAssessments: 3,
  certificatesIssued: 2, pendingEnrollments: 1, activeEnrollments: 4,
};

export const mockTrainers: Trainer[] = [
  { id: 't1', name: 'Dr. Arun Kumar', email: 'arun@lms.com', mobile: '9876543210', qualification: 'Ph.D Computer Science', expertise: ['Anthropic SDK', 'AI Workflows', 'Python'], experience: 12, certifications: [{ name: 'AWS Solutions Architect' }, { name: 'Google Cloud Professional' }], bio: 'Senior full-stack architect with 12 years in enterprise development.', availability: 'full-time', status: 'active', assignedCourses: ['c_claude_dev', 'c_claude_arch_found'], avatar: 'https://randomuser.me/api/portraits/men/32.jpg', joinedAt: '2022-03-15', totalBatches: 4, rating: 4.8 },
  { id: 't2', name: 'Meena Subramaniam', email: 'meena@lms.com', mobile: '9765432109', qualification: 'M.Tech Data Science', expertise: ['Python', 'Prompt Engineering', 'Generative AI'], experience: 8, certifications: [{ name: 'TensorFlow Developer' }, { name: 'Microsoft Azure AI' }], bio: 'ML engineer specializing in production-grade AI systems.', availability: 'full-time', status: 'active', assignedCourses: ['c_claude_assoc'], avatar: 'https://randomuser.me/api/portraits/women/44.jpg', joinedAt: '2023-01-10', totalBatches: 2, rating: 4.9 },
  { id: 't3', name: 'Rajesh Pillai', email: 'rajesh@lms.com', mobile: '9654321098', qualification: 'B.Tech ECE', expertise: ['Java', 'Spring Boot', 'Microservices'], experience: 10, certifications: [{ name: 'Oracle Java SE' }, { name: 'Spring Professional' }], bio: 'Backend specialist with deep expertise in distributed systems.', availability: 'part-time', status: 'active', assignedCourses: [], avatar: 'https://randomuser.me/api/portraits/men/45.jpg', joinedAt: '2022-08-20', totalBatches: 0, rating: 4.6 },
  { id: 't4', name: 'Divya Ramesh', email: 'divya@lms.com', mobile: '9543210987', qualification: 'MBA IT', expertise: ['UI/UX', 'Figma', 'Design Thinking'], experience: 6, certifications: [{ name: 'Google UX Design' }, { name: 'Interaction Design Foundation' }], bio: 'UX specialist focused on accessibility and human-centered design.', availability: 'contract', status: 'inactive', assignedCourses: [], avatar: 'https://randomuser.me/api/portraits/women/68.jpg', joinedAt: '2023-06-01', totalBatches: 0, rating: 4.7 },
  { id: 't5', name: 'Suresh Nataraj', email: 'suresh@lms.com', mobile: '9432109876', qualification: 'M.Sc Cybersecurity', expertise: ['Multi-Agent Frameworks', 'AI Safety', 'VAPT'], experience: 9, certifications: [{ name: 'CEH' }, { name: 'CISSP' }, { name: 'CompTIA Security+' }], bio: 'Certified ethical hacker with government and enterprise experience.', availability: 'full-time', status: 'active', assignedCourses: ['c_claude_arch_prof'], avatar: 'https://randomuser.me/api/portraits/men/76.jpg', joinedAt: '2023-03-15', totalBatches: 2, rating: 4.5 },
];

export const mockTrainees: Trainee[] = [
  { id: 'tr1', name: 'Aarav Sharma', email: 'aarav@email.com', mobile: '9811111111', type: 'fresher', location: 'Chennai', status: 'active', enrolledCourses: ['c_claude_assoc'], assignedBatch: 'b_claude_assoc_on', overallProgress: 72, attendancePercentage: 88, avatar: 'https://randomuser.me/api/portraits/men/11.jpg', joinedAt: '2024-01-15' },
  { id: 'tr2', name: 'Priya Nair', email: 'priya@email.com', mobile: '9822222222', type: 'professional', company: 'TCS', experience: 3, location: 'Bangalore', status: 'active', enrolledCourses: ['c_claude_dev'], assignedBatch: 'b_claude_dev_on', overallProgress: 45, attendancePercentage: 62, avatar: 'https://randomuser.me/api/portraits/women/21.jpg', joinedAt: '2024-02-20' },
  { id: 'tr3', name: 'Karthik Raja', email: 'karthik@email.com', mobile: '9833333333', type: 'fresher', location: 'Hyderabad', status: 'active', enrolledCourses: ['c_claude_assoc'], assignedBatch: 'b_claude_assoc_on', overallProgress: 91, attendancePercentage: 96, avatar: 'https://randomuser.me/api/portraits/men/52.jpg', joinedAt: '2024-01-15' },
  { id: 'tr4', name: 'Ananya Reddy', email: 'ananya@email.com', mobile: '9844444444', type: 'professional', company: 'Wipro', experience: 5, location: 'Chennai', status: 'pending', enrolledCourses: ['c_claude_arch_prof'], overallProgress: 0, attendancePercentage: 0, avatar: 'https://randomuser.me/api/portraits/women/33.jpg', joinedAt: '2024-08-01' },
  { id: 'tr5', name: 'Vijay Kumar', email: 'vijay@email.com', mobile: '9855555555', type: 'fresher', location: 'Mumbai', status: 'active', enrolledCourses: ['c_claude_arch_found'], assignedBatch: 'b_claude_arch_found_off', overallProgress: 30, attendancePercentage: 55, avatar: 'https://randomuser.me/api/portraits/men/61.jpg', joinedAt: '2024-03-10' },
  { id: 'tr6', name: 'Lakshmi Menon', email: 'lakshmi@email.com', officialEmail: 'lakshmi.menon@infosys.com', mobile: '9866666666', type: 'professional', company: 'Infosys', experience: 2, location: 'Pune', status: 'active', enrolledCourses: ['c_claude_dev'], assignedBatch: 'b_claude_dev_on', overallProgress: 68, attendancePercentage: 80, avatar: 'https://randomuser.me/api/portraits/women/58.jpg', joinedAt: '2024-02-20' },
  { id: 'tr7', name: 'Rohan Gupta', email: 'rohan@email.com', mobile: '9877777777', type: 'student', location: 'Delhi', status: 'active', enrolledCourses: ['c_claude_assoc'], assignedBatch: 'b_claude_assoc_on', overallProgress: 85, attendancePercentage: 92, avatar: 'https://randomuser.me/api/portraits/men/82.jpg', joinedAt: '2024-04-10' },
  { id: 'tr8', name: 'Sneha Patel', email: 'sneha@email.com', mobile: '9888888888', type: 'student', location: 'Ahmedabad', status: 'pending', enrolledCourses: ['c_claude_dev'], overallProgress: 0, attendancePercentage: 0, avatar: 'https://randomuser.me/api/portraits/women/42.jpg', joinedAt: '2024-08-25' },
];

export const mockCourses: Course[] = [
  { id: 'c_claude_assoc', name: 'Claude Certified Associate - Foundational Level', code: 'CLD-ASC-001', description: 'For people who have used Claude casually, or not at all, and want to use it well at work.', category: 'AI & Generative AI', categoryId: 'cat7', level: 'beginner', duration: 40, mode: 'both', status: 'published', objectives: ['Understand Claude capabilities', 'Basic prompt engineering', 'Workplace productivity with AI'], prerequisites: ['No prior AI experience required'], skills: ['Claude 3.5 Sonnet', 'Prompting', 'Artifacts', 'Projects'], trainerId: 't2', trainerName: 'Meena Subramaniam', hasAssessment: true, hasCertificate: true, enrolledCount: 57, completedCount: 0, rating: 4.7, createdAt: '2026-08-20', updatedAt: '2026-08-25' },
  { id: 'c_claude_dev', name: 'Claude Certified Developer - Foundational Level', code: 'CLD-DEV-001', description: 'For people already using Claude daily who want to build workflows their whole team can run.', category: 'AI & Generative AI', categoryId: 'cat7', level: 'intermediate', duration: 60, mode: 'online', status: 'published', objectives: ['Build API integrations', 'Implement Claude SDKs', 'Design robust AI workflows'], prerequisites: ['Basic programming knowledge', 'Familiarity with APIs'], skills: ['Anthropic API', 'Python', 'JSON Mode', 'Tool Use / Function Calling'], trainerId: 't1', trainerName: 'Dr. Arun Kumar', hasAssessment: true, hasCertificate: true, enrolledCount: 46, completedCount: 0, rating: 4.9, createdAt: '2026-08-21', updatedAt: '2026-08-25' },
  { id: 'c_claude_arch_found', name: 'Claude Certified Architect - Foundational Level', code: 'CLD-ARF-001', description: 'For developers and technical professionals who want to build with Claude, not just work alongside it.', category: 'AI & Generative AI', categoryId: 'cat7', level: 'intermediate', duration: 80, mode: 'offline', status: 'published', objectives: ['Architect AI applications', 'Optimize prompt templates', 'Handle context windows efficiently'], prerequisites: ['Software architecture experience', 'Python or TypeScript'], skills: ['Prompt Engineering', 'RAG (Retrieval-Augmented Generation)', 'Context Management', 'Model Selection'], trainerId: 't1', trainerName: 'Dr. Arun Kumar', hasAssessment: true, hasCertificate: true, enrolledCount: 37, completedCount: 0, rating: 4.8, createdAt: '2026-08-22', updatedAt: '2026-08-25' },
  { id: 'c_claude_arch_prof', name: 'Claude Certified Architect - Professional Level', code: 'CLD-ARP-001', description: 'For leaders and advanced developers who want to design complex, multi-agent AI systems and govern enterprise-wide deployments.', category: 'AI & Generative AI', categoryId: 'cat7', level: 'advanced', duration: 120, mode: 'both', status: 'published', objectives: ['Design multi-agent systems', 'Enterprise security & governance', 'Latency and cost optimization'], prerequisites: ['Advanced software design', 'AI development experience'], skills: ['Multi-Agent Frameworks', 'Model Fine-tuning Evaluation', 'AI Safety & Moderation', 'Enterprise Architecture'], trainerId: 't5', trainerName: 'Suresh Nataraj', hasAssessment: true, hasCertificate: true, enrolledCount: 29, completedCount: 0, rating: 4.9, createdAt: '2026-08-23', updatedAt: '2026-08-25' },
];

export const mockBatches: Batch[] = [
  { id: 'b_claude_assoc_on', name: 'CLD-ASC Online Aug26', courseId: 'c_claude_assoc', courseName: 'Claude Certified Associate - Foundational Level', trainerId: 't2', trainerName: 'Meena Subramaniam', startDate: '2026-09-01', endDate: '2026-10-15', seatCapacity: 100, enrolledCount: 45, status: 'active', attendanceRequired: 75, sessions: [
    { id: 's_assoc_on_1', date: '2026-09-02', startTime: '10:00', endTime: '12:00', topic: 'Introduction to Claude SDK', status: 'scheduled' },
  ] },
  { id: 'b_claude_assoc_off', name: 'CLD-ASC Chennai Sep26', courseId: 'c_claude_assoc', courseName: 'Claude Certified Associate - Foundational Level', trainerId: 't2', trainerName: 'Meena Subramaniam', locationId: 'l1', locationName: 'Chennai Tech Center', startDate: '2026-09-15', endDate: '2026-10-30', seatCapacity: 30, enrolledCount: 12, status: 'upcoming', attendanceRequired: 80, sessions: [
    { id: 's_assoc_off_1', date: '2026-09-16', startTime: '11:00', endTime: '13:00', topic: 'Prompt Engineering Fundamentals', status: 'scheduled' },
  ] },
  { id: 'b_claude_dev_on', name: 'CLD-DEV Online Sep26', courseId: 'c_claude_dev', courseName: 'Claude Certified Developer - Foundational Level', trainerId: 't1', trainerName: 'Dr. Arun Kumar', startDate: '2026-09-05', endDate: '2026-10-20', seatCapacity: 80, enrolledCount: 38, status: 'active', attendanceRequired: 75, sessions: [
    { id: 's_dev_on_1', date: '2026-09-06', startTime: '14:00', endTime: '16:00', topic: 'Building Custom Tools with Claude', status: 'scheduled' },
  ] },
  { id: 'b_claude_dev_off', name: 'CLD-DEV Bangalore Oct26', courseId: 'c_claude_dev', courseName: 'Claude Certified Developer - Foundational Level', trainerId: 't1', trainerName: 'Dr. Arun Kumar', locationId: 'l2', locationName: 'Hyderabad Security Lab', startDate: '2026-10-01', endDate: '2026-11-15', seatCapacity: 25, enrolledCount: 8, status: 'upcoming', attendanceRequired: 80, sessions: [] },
  { id: 'b_claude_arch_found_on', name: 'CLD-ARF Online Oct26', courseId: 'c_claude_arch_found', courseName: 'Claude Certified Architect - Foundational Level', trainerId: 't1', trainerName: 'Dr. Arun Kumar', startDate: '2026-10-10', endDate: '2026-12-05', seatCapacity: 60, enrolledCount: 22, status: 'upcoming', attendanceRequired: 75, sessions: [] },
  { id: 'b_claude_arch_found_off', name: 'CLD-ARF Hyderabad Oct26', courseId: 'c_claude_arch_found', courseName: 'Claude Certified Architect - Foundational Level', trainerId: 't1', trainerName: 'Dr. Arun Kumar', locationId: 'l2', locationName: 'Hyderabad Security Lab', startDate: '2026-10-15', endDate: '2026-12-10', seatCapacity: 20, enrolledCount: 15, status: 'active', attendanceRequired: 80, sessions: [
    { id: 's_arch_found_off_1', date: '2026-10-16', startTime: '09:30', endTime: '11:30', topic: 'Enterprise Architecture Patterns', status: 'scheduled' },
  ] },
  { id: 'b_claude_arch_prof_on', name: 'CLD-ARP Online Nov26', courseId: 'c_claude_arch_prof', courseName: 'Claude Certified Architect - Professional Level', trainerId: 't5', trainerName: 'Suresh Nataraj', startDate: '2026-11-01', endDate: '2026-12-20', seatCapacity: 50, enrolledCount: 19, status: 'upcoming', attendanceRequired: 75, sessions: [] },
  { id: 'b_claude_arch_prof_off', name: 'CLD-ARP Chennai Nov26', courseId: 'c_claude_arch_prof', courseName: 'Claude Certified Architect - Professional Level', trainerId: 't5', trainerName: 'Suresh Nataraj', locationId: 'l1', locationName: 'Chennai Tech Center', startDate: '2026-11-10', endDate: '2026-12-30', seatCapacity: 20, enrolledCount: 10, status: 'upcoming', attendanceRequired: 85, sessions: [] },
];

export const mockEnrollments: Enrollment[] = [
  { id: 'e1', traineeId: 'tr1', traineeName: 'Aarav Sharma', traineeEmail: 'aarav@email.com', courseId: 'c_claude_assoc', courseName: 'Claude Certified Associate - Foundational Level', courseMode: 'offline', batchId: 'b_claude_assoc_off', batchName: 'CLD-ASC Chennai Sep26', enrolledAt: '2024-07-20', status: 'approved', progress: 72, approvedAt: '2024-07-22', approvedBy: 'Admin' },
  { id: 'e2', traineeId: 'tr2', traineeName: 'Priya Nair', traineeEmail: 'priya@email.com', courseId: 'c_claude_dev', courseName: 'Claude Certified Developer - Foundational Level', courseMode: 'online', batchId: 'b_claude_dev_on', batchName: 'CLD-DEV Online Sep26', enrolledAt: '2024-08-10', status: 'approved', progress: 45 },
  { id: 'e3', traineeId: 'tr4', traineeName: 'Ananya Reddy', traineeEmail: 'ananya@email.com', courseId: 'c_claude_arch_prof', courseName: 'Claude Certified Architect - Professional Level', courseMode: 'offline', enrolledAt: '2024-08-20', status: 'pending', progress: 0 },
  { id: 'e4', traineeId: 'tr5', traineeName: 'Vijay Kumar', traineeEmail: 'vijay@email.com', courseId: 'c_claude_arch_found', courseName: 'Claude Certified Architect - Foundational Level', courseMode: 'offline', batchId: 'b_claude_arch_found_off', batchName: 'CLD-ARF Hyderabad Oct26', enrolledAt: '2024-08-15', status: 'approved', progress: 30 },
  { id: 'e5', traineeId: 'tr6', traineeName: 'Lakshmi Menon', traineeEmail: 'lakshmi@email.com', courseId: 'c_claude_dev', courseName: 'Claude Certified Developer - Foundational Level', courseMode: 'online', batchId: 'b_claude_dev_on', batchName: 'CLD-DEV Online Sep26', enrolledAt: '2024-08-12', status: 'approved', progress: 68 },
];

export const mockAttendance: AttendanceRecord[] = [
  { id: 'a1', traineeId: 'tr1', traineeName: 'Aarav Sharma', batchId: 'b_claude_assoc_off', batchName: 'CLD-ASC Chennai Sep26', sessionId: 's1', sessionDate: '2024-08-26', status: 'present', percentage: 88, required: 80, flagged: false },
  { id: 'a2', traineeId: 'tr2', traineeName: 'Priya Nair', batchId: 'b_claude_dev_on', batchName: 'CLD-DEV Online Sep26', sessionId: 's3', sessionDate: '2024-08-25', status: 'absent', percentage: 62, required: 75, flagged: true },
  { id: 'a3', traineeId: 'tr5', traineeName: 'Vijay Kumar', batchId: 'b_claude_arch_found_off', batchName: 'CLD-ARF Hyderabad Oct26', sessionId: 's1', sessionDate: '2024-08-26', status: 'late', percentage: 55, required: 80, flagged: true },
  { id: 'a4', traineeId: 'tr3', traineeName: 'Karthik Raja', batchId: 'b_claude_assoc_off', batchName: 'CLD-ASC Chennai Sep26', sessionId: 's1', sessionDate: '2024-08-26', status: 'present', percentage: 96, required: 80, flagged: false },
];

export const mockAssessments: Assessment[] = [
  { id: 'as1', title: 'Claude Certified Associate Exam', courseId: 'c_claude_assoc', courseName: 'Claude Certified Associate - Foundational Level', type: 'final', totalQuestions: 50, passingScore: 70, maxAttempts: 2, duration: 90, status: 'active', createdAt: '2026-08-20' },
  { id: 'as2', title: 'Claude Developer SDKs Quiz', courseId: 'c_claude_dev', courseName: 'Claude Certified Developer - Foundational Level', type: 'quiz', totalQuestions: 20, passingScore: 60, maxAttempts: 3, duration: 30, status: 'active', createdAt: '2026-08-21' },
  { id: 'as3', title: 'Enterprise Multi-Agent Architecture Assessment', courseId: 'c_claude_arch_prof', courseName: 'Claude Certified Architect - Professional Level', type: 'assignment', totalQuestions: 10, passingScore: 75, maxAttempts: 1, duration: 180, status: 'active', createdAt: '2026-08-23' },
];

export const mockCertificates: Certificate[] = [
  { id: 'cert1', courseId: 'c_claude_dev', courseName: 'Claude Certified Developer - Foundational Level', traineeId: 'tr3', traineeName: 'Karthik Raja', issuedAt: '2026-08-25', status: 'issued', verificationCode: 'LMS-2026-CERT-001', minScore: 70, minAttendance: 75 },
  { id: 'cert2', courseId: 'c_claude_arch_found', courseName: 'Claude Certified Architect - Foundational Level', traineeId: 'tr6', traineeName: 'Lakshmi Menon', issuedAt: '2026-08-25', status: 'issued', verificationCode: 'LMS-2026-CERT-002', minScore: 60, minAttendance: 75 },
];

export const mockLocations: Location[] = [
  { id: 'l1', name: 'Chennai Tech Center', address: '45, Mount Road', city: 'Chennai', state: 'Tamil Nadu', buildings: [{ id: 'bl1', name: 'Block A', rooms: [{ id: 'r1', name: 'Lab 101', capacity: 30, facilities: ['Projector', 'AC', 'Whiteboard'] }, { id: 'r2', name: 'Lab 102', capacity: 25, facilities: ['Projector', 'AC'] }] }] },
  { id: 'l2', name: 'Hyderabad Security Lab', address: '12, Hitech City', city: 'Hyderabad', state: 'Telangana', buildings: [{ id: 'bl2', name: 'Main Building', rooms: [{ id: 'r3', name: 'Security Lab', capacity: 20, facilities: ['Dual Monitor', 'AC', 'Network Sandbox'] }] }] },
];

export const mockCategories: Category[] = [
  { id: 'cat1', name: 'Web Development', description: 'Frontend, backend and full stack web technologies', coursesCount: 18, status: 'active' },
  { id: 'cat2', name: 'Data Science', description: 'ML, AI, analytics and data engineering', coursesCount: 12, status: 'active' },
  { id: 'cat3', name: 'Design', description: 'UI/UX, graphic design and product design', coursesCount: 8, status: 'active' },
  { id: 'cat4', name: 'Backend', description: 'Server-side development and APIs', coursesCount: 15, status: 'active' },
  { id: 'cat5', name: 'Security', description: 'Cybersecurity, ethical hacking, compliance', coursesCount: 7, status: 'active' },
  { id: 'cat6', name: 'Cloud', description: 'AWS, Azure, GCP and DevOps', coursesCount: 10, status: 'active' },
  { id: 'cat7', name: 'AI & Generative AI', description: 'Large language models, prompting, workflows and agentic AI systems', coursesCount: 4, status: 'active' },
];

export const enrollmentTrend = { labels: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug'], datasets: [{ label: 'Online', data: [42,65,78,90,115,132,148,156], borderColor: '#6366f1', backgroundColor: 'rgba(99,102,241,0.1)', fill: true, tension: 0.4 }, { label: 'Offline', data: [18,22,31,38,45,52,58,67], borderColor: '#10b981', backgroundColor: 'rgba(16,185,129,0.1)', fill: true, tension: 0.4 }] };
export const attendanceOverview = { labels: ['FSWD Batch', 'MLP Online', 'CEH Batch', 'UI/UX Boot'], datasets: [{ label: 'Avg Attendance %', data: [84, 71, 92, 78], backgroundColor: ['#6366f1','#10b981','#f59e0b','#8b5cf6'] }] };
export const assessmentPerformance = { labels: ['0-40', '40-60', '60-80', '80-100'], datasets: [{ label: 'Trainees', data: [12, 28, 84, 143], backgroundColor: ['#ef4444','#f59e0b','#6366f1','#10b981'] }] };
export const courseDistribution = { labels: ['Web Dev', 'Data Science', 'Design', 'Backend', 'Security', 'Cloud'], datasets: [{ data: [18, 12, 8, 15, 7, 10], backgroundColor: ['#6366f1','#10b981','#f59e0b','#8b5cf6','#ef4444','#06b6d4'] }] };

export const mockTrainerAttendance: TrainerAttendanceRecord[] = [
  { id: 'ta1', trainerId: 't1', trainerName: 'Dr. Arun Kumar', batchId: 'b_claude_dev_on', batchName: 'CLD-DEV Online Sep26', sessionId: 's_dev_on_1', sessionDate: '2026-09-06', status: 'present', percentage: 95, required: 90, flagged: false },
  { id: 'ta2', trainerId: 't2', trainerName: 'Meena Subramaniam', batchId: 'b_claude_assoc_on', batchName: 'CLD-ASC Online Aug26', sessionId: 's_assoc_on_1', sessionDate: '2026-09-02', status: 'present', percentage: 100, required: 90, flagged: false },
  { id: 'ta3', trainerId: 't5', trainerName: 'Suresh Nataraj', batchId: 'b_claude_arch_prof_off', batchName: 'CLD-ARP Chennai Nov26', sessionId: 's_arch_prof_off_1', sessionDate: '2026-11-10', status: 'absent', percentage: 75, required: 90, flagged: true },
  { id: 'ta4', trainerId: 't1', trainerName: 'Dr. Arun Kumar', batchId: 'b_claude_arch_found_off', batchName: 'CLD-ARF Hyderabad Oct26', sessionId: 's_arch_found_off_1', sessionDate: '2026-10-16', status: 'late', percentage: 88, required: 90, flagged: false },
];

export const mockTrainerEnrollments: Enrollment[] = [
  { id: 'te1', traineeId: 't1', traineeName: 'Dr. Arun Kumar', traineeEmail: 'arun@lms.com', courseId: 'c_claude_dev', courseName: 'Claude Certified Developer - Foundational Level', courseMode: 'online', batchId: 'b_claude_dev_on', batchName: 'CLD-DEV Online Sep26', enrolledAt: '2026-08-25', status: 'approved', progress: 100, approvedAt: '2026-08-25', approvedBy: 'Admin' },
  { id: 'te2', traineeId: 't2', traineeName: 'Meena Subramaniam', traineeEmail: 'meena@lms.com', courseId: 'c_claude_assoc', courseName: 'Claude Certified Associate - Foundational Level', courseMode: 'offline', batchId: 'b_claude_assoc_off', batchName: 'CLD-ASC Chennai Sep26', enrolledAt: '2026-08-24', status: 'approved', progress: 100, approvedAt: '2026-08-24', approvedBy: 'Admin' },
  { id: 'te3', traineeId: 't5', traineeName: 'Suresh Nataraj', traineeEmail: 'suresh@lms.com', courseId: 'c_claude_arch_prof', courseName: 'Claude Certified Architect - Professional Level', courseMode: 'offline', batchId: 'b_claude_arch_prof_off', batchName: 'CLD-ARP Chennai Nov26', enrolledAt: '2026-08-25', status: 'pending', progress: 0 },
];


