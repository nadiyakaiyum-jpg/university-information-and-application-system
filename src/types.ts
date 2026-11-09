export type UserRole = 'student' | 'admin';
export type Language = 'en' | 'bn';

export interface User {
  id: number;
  student_id: string; // e.g. "admin" or "2026001"
  name: string;
  email: string;
  role: UserRole;
  department?: string;
  semester?: string;
  avatar?: string;
  phone?: string;
  batch?: string;
  bloodGroup?: string;
  validUntil?: string;
  cgpa?: number;
  creditsCompleted?: number;
  totalCredits?: number;
  emergencyContact?: string;
  registrationNo?: string;
}

export type NoticeCategory =
  | 'Academic'
  | 'Examination'
  | 'Admission'
  | 'Administrative'
  | 'Financial'
  | 'Scholarship'
  | 'Events'
  | 'General';

export interface Notice {
  id: number;
  title: string;
  title_bn?: string;
  body: string;
  body_bn?: string;
  category: NoticeCategory;
  isPinned?: boolean;
  priority?: 'Urgent' | 'Important' | 'Normal';
  publishedBy: string;
  created_at: string;
}

export type RoutineType = 'Class' | 'Exam';

export interface Routine {
  id: number;
  type: RoutineType;
  department: string;
  semester: string;
  day_date: string;
  time_text: string;
  course: string;
  courseCode?: string;
  room?: string;
  instructor?: string;
}

export type ApplicationType =
  | 'Exam Permission'
  | 'Lost ID Card'
  | 'Transport Fee Off'
  | 'Semester Drop'
  | 'Scholarship / Financial Aid'
  | 'Transcript / Certificate'
  | 'Hostel Accommodation'
  | 'Other Application';

export type ApplicationStatus = 'Pending' | 'Approved' | 'Rejected';

export interface ApplicationTimelineStep {
  title: string;
  title_bn: string;
  status: 'completed' | 'current' | 'pending';
  date?: string;
  actor?: string;
}

export interface Application {
  id: number;
  application_no: string; // e.g. "APP-2026-104"
  user_id: number;
  student_name: string;
  student_id: string;
  department: string;
  semester: string;
  phone: string;
  app_type: ApplicationType;
  subject: string;
  details: string;
  status: ApplicationStatus;
  admin_remark?: string;
  reviewed_at?: string;
  reviewed_by?: string;
  created_at: string;
  attachmentName?: string;
  timeline?: ApplicationTimelineStep[];
}

export interface CourseGrade {
  code: string;
  title: string;
  credits: number;
  grade: string;
  gradePoint: number;
}

export interface SemesterResult {
  semesterName: string;
  gpa: number;
  credits: number;
  courses: CourseGrade[];
}
