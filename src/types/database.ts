export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      News: {
        Row: {
          id: number
          title: string
          slug: string
          content: string
          imageUrl: string | null
          published: boolean
          publishDate: string
          author: string | null
          excerpt: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          title: string
          slug: string
          content: string
          imageUrl?: string | null
          published?: boolean
          publishDate?: string
          author?: string | null
          excerpt?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          title?: string
          slug?: string
          content?: string
          imageUrl?: string | null
          published?: boolean
          publishDate?: string
          author?: string | null
          excerpt?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      Event: {
        Row: {
          id: number
          title: string
          slug: string
          content: string
          imageUrl: string | null
          published: boolean
          date: string
          location: string | null
          category: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          title: string
          slug: string
          content: string
          imageUrl?: string | null
          published?: boolean
          date: string
          location?: string | null
          category?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          title?: string
          slug?: string
          content?: string
          imageUrl?: string | null
          published?: boolean
          date?: string
          location?: string | null
          category?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      it_assets: {
        Row: {
          id: string
          asset_type: ItAssetType
          name: string
          description: string | null
          access_url: string | null
          auto_provision: boolean
          license_limit: number | null
          current_usage: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          asset_type: ItAssetType
          name: string
          description?: string | null
          access_url?: string | null
          auto_provision?: boolean
          license_limit?: number | null
          current_usage?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          asset_type?: ItAssetType
          name?: string
          description?: string | null
          access_url?: string | null
          auto_provision?: boolean
          license_limit?: number | null
          current_usage?: number
          created_at?: string
          updated_at?: string
        }
      }
      student_it_access: {
        Row: {
          id: string
          student_id: string
          asset_id: string
          credentials: Record<string, any> | null
          activated_at: string | null
          expires_at: string | null
          deactivated_at: string | null
          status: ItAccessStatus
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          student_id: string
          asset_id: string
          credentials?: Record<string, any> | null
          activated_at?: string | null
          expires_at?: string | null
          deactivated_at?: string | null
          status?: ItAccessStatus
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          student_id?: string
          asset_id?: string
          credentials?: Record<string, any> | null
          activated_at?: string | null
          expires_at?: string | null
          deactivated_at?: string | null
          status?: ItAccessStatus
          created_at?: string
          updated_at?: string
        }
      }
      AuditLog: {
        Row: {
          id: number
          action: string
          entity_table: string
          entity_id: string
          metadata: Record<string, any>
          created_at: string
          user_id?: string
        }
        Insert: {
          id?: number
          action: string
          entity_table: string
          entity_id: string
          metadata?: Record<string, any>
          created_at?: string
          user_id?: string
        }
        Update: {
          id?: number
          action?: string
          entity_table?: string
          entity_id?: string
          metadata?: Record<string, any>
          created_at?: string
          user_id?: string
        }
      }
      modules: {
        Row: {
          id: string
          code: string
          title: string
          description: string | null
          credits: number
          capacity: number
          department_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          code: string
          title: string
          description?: string | null
          credits?: number
          capacity?: number
          department_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          code?: string
          title?: string
          description?: string | null
          credits?: number
          capacity?: number
          department_id?: string | null
          created_at?: string
        }
      }
      class_sessions: {
        Row: {
          id: string
          module_id: string
          semester_id: string
          day_of_week: number
          start_time: string
          end_time: string
          location_type: 'CAMPUS' | 'ONLINE'
          location_detail: string | null
        }
        Insert: {
          id?: string
          module_id: string
          semester_id: string
          day_of_week: number
          start_time: string
          end_time: string
          location_type?: 'CAMPUS' | 'ONLINE'
          location_detail?: string | null
        }
        Update: {
          id?: string
          module_id?: string
          semester_id?: string
          day_of_week?: number
          start_time?: string
          end_time?: string
          location_type?: 'CAMPUS' | 'ONLINE'
          location_detail?: string | null
        }
      }
      module_enrollments: {
        Row: {
          id: string
          student_id: string
          module_id: string
          semester_id: string
          status: string
          grade: number | null
          grade_status: string
          finalized_by: string | null
          finalized_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          student_id: string
          module_id: string
          semester_id: string
          status?: string
          grade?: number | null
          grade_status?: string
          finalized_by?: string | null
          finalized_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          student_id?: string
          module_id?: string
          semester_id?: string
          status?: string
          grade?: number | null
          grade_status?: string
          finalized_by?: string | null
          finalized_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      students: {
        Row: {
          id: string
          user_id: string
          student_id: string
          application_id: string
          program_id: string
          enrollment_status: string
          institutional_email: string
          personal_email: string
          start_date: string
          expected_graduation_date: string
          lms_access_data: Record<string, any>
          tuition_deposit_paid: boolean
          tuition_deposit_paid_at: string | null
          full_tuition_paid: boolean
          full_tuition_paid_at: string | null
          housing_fee_paid: boolean
          housing_fee_paid_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          student_id: string
          application_id: string
          program_id: string
          enrollment_status?: string
          institutional_email: string
          personal_email: string
          start_date: string
          expected_graduation_date: string
          lms_access_data?: Record<string, any>
          tuition_deposit_paid?: boolean
          tuition_deposit_paid_at?: string | null
          full_tuition_paid?: boolean
          full_tuition_paid_at?: string | null
          housing_fee_paid?: boolean
          housing_fee_paid_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          student_id?: string
          application_id?: string
          program_id?: string
          enrollment_status?: string
          institutional_email?: string
          personal_email?: string
          start_date?: string
          expected_graduation_date?: string
          lms_access_data?: Record<string, any>
          tuition_deposit_paid?: boolean
          tuition_deposit_paid_at?: string | null
          full_tuition_paid?: boolean
          full_tuition_paid_at?: string | null
          housing_fee_paid?: boolean
          housing_fee_paid_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          email: string
          first_name: string | null
          last_name: string | null
          role: UserRole
          country_of_residence: string | null
          created_at: string
          updated_at: string
          avatar_url: string | null
          student_id: string | null
          date_of_birth: string | null
          phone_code: string | null
          phone_number: string | null
          citizenship: string | null
          address: string | null
          city: string | null
          state_province: string | null
          zipcode: string | null
          gender: string | null
        }
        Insert: {
          id: string
          email: string
          first_name?: string | null
          last_name?: string | null
          role?: UserRole
          country_of_residence?: string | null
          created_at?: string
          updated_at?: string
          avatar_url?: string | null
          student_id?: string | null
          date_of_birth?: string | null
          phone_code?: string | null
          phone_number?: string | null
          citizenship?: string | null
          address?: string | null
          city?: string | null
          state_province?: string | null
          zipcode?: string | null
          gender?: string | null
        }
        Update: {
          id?: string
          email?: string
          first_name?: string | null
          last_name?: string | null
          role?: UserRole
          country_of_residence?: string | null
          created_at?: string
          updated_at?: string
          avatar_url?: string | null
          student_id?: string | null
          date_of_birth?: string | null
          phone_code?: string | null
          phone_number?: string | null
          citizenship?: string | null
          address?: string | null
          city?: string | null
          state_province?: string | null
          zipcode?: string | null
          gender?: string | null
        }
      }
    }
  }
}

export type News = Database['public']['Tables']['News']['Row']
export type Event = Database['public']['Tables']['Event']['Row']
export type AuditLog = Database['public']['Tables']['AuditLog']['Row']
export type Module = Database['public']['Tables']['modules']['Row']
export type ClassSession = Database['public']['Tables']['class_sessions']['Row']
export type ModuleEnrollment = Database['public']['Tables']['module_enrollments']['Row']
export type Student = Database['public']['Tables']['students']['Row']
export type Profile = Database['public']['Tables']['profiles']['Row']

export type School = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export type Department = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  headofdepartmentid?: string | null;
  schoolId: string;
  createdAt: string;
  updatedAt: string;
}

export type Course = {
  id: string;
  title: string;
  slug: string;
  degreeLevel: 'CERTIFICATE' | 'DIPLOMA' | 'BACHELOR' | 'MASTER';
  degreeType?: string;
  duration: string;
  credits?: number;
  ects?: number;
  description: string | null;
  language: string;
  entryRequirements: string | null;
  minimumGrade: string | null;
  careerPaths: string | null;
  imageUrl: string | null;
  schoolId: string;
  departmentId: string | null;
  sections?: any[];
  programType?: string;
  createdAt: string;
  updatedAt: string;
}


export type Subject = {
  id: string;
  name: string;
  creditUnits: number;
  semester: number;
  courseId: string;
  code?: string;
  area?: string;
  eligibility?: string;
}

export type Faculty = {
  id: string;
  name: string;
  role: string;
  bio: string | null;
  imageUrl: string | null;
  email: string | null;
  schoolId: string;
  departmentId: string | null;
  createdAt: string;
  updatedAt: string;
}

export type DegreeLevel = 'BACHELOR' | 'MASTER';

export type ApplicationStatus = 'DRAFT' | 'SUBMITTED' | 'UNDER_REVIEW' | 'REJECTED' | 'DOCS_REQUIRED' | 'ADMITTED' | 'OFFER_ACCEPTED' | 'PAYMENT_SUBMITTED';

export type Application = {
  id: string;
  user_id: string;
  course_id: string;
  intake?: string;
  status: ApplicationStatus;
  personal_info: {
    firstName: string;
    lastName: string;
    passportNumber?: string;
    dateOfBirth?: string;
    gender?: string;
    nationality?: string;
    streetAddress?: string;
    city?: string;
    country?: string;
  };
  contact_details: {
    email: string;
    phone: string;
    addressLine1?: string;
    addressLine2?: string;
    postalCode?: string;
    city?: string;
    country?: string;
    streetAddress?: string;
  };
  education_history?: any;
  motivation?: any;
  submitted_at?: string;
  created_at: string;
  updated_at: string;
  application_number?: string;
  internal_notes?: string;
  document_request_note?: string;
  requested_documents?: string[];
  course?: Course & { school?: School };
  user?: {
    first_name: string;
    last_name: string;
    email: string;
    student_id?: string;
    date_of_birth?: string;
  };
}

export type DocumentType = 'PASSPORT' | 'TRANSCRIPT' | 'CERTIFICATE' | 'CV' | 'MOTIVATION_LETTER' | 'LANGUAGE_CERT' | 'OTHER';

export type ApplicationDocument = {
    id: string;
    application_id: string;
    type: DocumentType;
    url: string;
    name: string;
    created_at: string;
}

export type Semester = {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  status?: string;
  isCurrent?: boolean;
}

export type HousingBuilding = {
  id: string;
  name: string;
  campus_location: string;
  description?: string;
  imageUrl?: string;
}

export type HousingRoom = {
  id: string;
  building_id: string;
  room_number: string;
  capacity: number;
  monthly_rate: number;
  amenities: string[];
  status: 'AVAILABLE' | 'OCCUPIED' | 'MAINTENANCE';
  room_type?: string;
  size?: string;
  images?: string[];
  building?: HousingBuilding;
}

export type HousingApplication = {
  id: string;
  student_id: string;
  semester_id: string;
  preferred_building_id: string | null;
  status: 'PENDING' | 'APPROVED' | 'ASSIGNED' | 'REJECTED' | 'CANCELLED';
  move_in_date: string;
  move_out_date: string;
  lease_duration?: number;
  room_type?: string;
  total_contract_value?: number;
  notes?: string;
  priority_score?: number;
  created_at: string;
  updated_at: string;
}

export type HousingAssignment = {
  id: string;
  application_id: string;
  student_id: string;
  room_id: string;
  start_date: string;
  end_date: string;
  status: 'ASSIGNED' | 'CHECKED_IN' | 'CHECKED_OUT' | 'CANCELLED';
  created_at: string;
}

export type HousingDeposit = {
  id: string;
  application_id: string;
  student_id: string;
  amount: number;
  payment_status: 'PENDING' | 'PAID' | 'FAILED';
  payment_method: string;
  transaction_id?: string;
  paid_at?: string;
}

export type HousingInvoice = {
  id: string;
  application_id: string;
  student_id: string;
  reference_number: string;
  total_amount: number;
  paid_amount: number;
  status: 'PENDING' | 'PAID' | 'OVERDUE' | 'CANCELLED';
  due_date: string;
  created_at: string;
}

export type ItAsset = Database['public']['Tables']['it_assets']['Row']
export type StudentItAccess = Database['public']['Tables']['student_it_access']['Row']

export type PaymentMethod = 'CREDIT_CARD' | 'BANK_TRANSFER' | 'PAYPAL' | 'MOBILE_PAY';

export type ItAssetType = 'LMS' | 'EMAIL' | 'VPN' | 'VIRTUAL_LAB' | 'LIBRARY' | 'SOFTWARE_LICENSE';

export type ItAccessStatus = 'PENDING' | 'ACTIVE' | 'EXPIRED' | 'DEACTIVATED';

export type UserRole = 'APPLICANT' | 'ADMISSIONS' | 'ADMIN';
