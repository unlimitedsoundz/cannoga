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
      class_schedules: {
        Row: {
          id: string
          subject_id: string
          semester_id: string
          course_id: string | null
          instructor_id: string | null
          day_of_week: number
          start_time: string
          end_time: string
          room: string | null
          building: string | null
          session_type: string
          recurrence_pattern: string
          start_date: string | null
          end_date: string | null
          notes: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          subject_id: string
          semester_id: string
          course_id?: string | null
          instructor_id?: string | null
          day_of_week: number
          start_time: string
          end_time: string
          room?: string | null
          building?: string | null
          session_type?: string
          recurrence_pattern?: string
          start_date?: string | null
          end_date?: string | null
          notes?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          subject_id?: string
          semester_id?: string
          course_id?: string | null
          instructor_id?: string | null
          day_of_week?: number
          start_time?: string
          end_time?: string
          room?: string | null
          building?: string | null
          session_type?: string
          recurrence_pattern?: string
          start_date?: string | null
          end_date?: string | null
          notes?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      class_sessions: {
        Row: {
          id: string
          schedule_id: string | null
          subject_id: string
          semester_id: string
          course_id: string | null
          instructor_id: string | null
          session_date: string
          start_time: string
          end_time: string
          room: string | null
          building: string | null
          session_type: string
          status: string
          cancellation_reason: string | null
          substitute_instructor_id: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          schedule_id?: string | null
          subject_id: string
          semester_id: string
          course_id?: string | null
          instructor_id?: string | null
          session_date: string
          start_time: string
          end_time: string
          room?: string | null
          building?: string | null
          session_type?: string
          status?: string
          cancellation_reason?: string | null
          substitute_instructor_id?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          schedule_id?: string | null
          subject_id?: string
          semester_id?: string
          course_id?: string | null
          instructor_id?: string | null
          session_date?: string
          start_time?: string
          end_time?: string
          room?: string | null
          building?: string | null
          session_type?: string
          status?: string
          cancellation_reason?: string | null
          substitute_instructor_id?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
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
           middle_name: string | null
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
           middle_name?: string | null
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
      document_records: {
        Row: {
          id: string
          student_id: string
          document_type: string
          title: string
          programme: string | null
          status: string
          storage_path: string | null
          version: number
          issue_date: string | null
          is_official: boolean
          is_student_visible: boolean
          metadata: any
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          student_id: string
          document_type: string
          title: string
          programme?: string | null
          status?: string
          storage_path?: string | null
          version?: number
          issue_date?: string | null
          is_official?: boolean
          is_student_visible?: boolean
          metadata?: any
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          student_id?: string
          document_type?: string
          title?: string
          programme?: string | null
          status?: string
          storage_path?: string | null
          version?: number
          issue_date?: string | null
          is_official?: boolean
          is_student_visible?: boolean
          metadata?: any
          created_at?: string
          updated_at?: string
        }
      }
      rooms: {
        Row: {
          id: string
          name: string
          building: string
          floor: string | null
          room_number: string
          capacity: number
          room_type: string
          campus: string
          accessibility: boolean
          equipment: any
          status: string
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          building: string
          floor?: string | null
          room_number: string
          capacity: number
          room_type?: string
          campus?: string
          accessibility?: boolean
          equipment?: any
          status?: string
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          building?: string
          floor?: string | null
          room_number?: string
          capacity?: number
          room_type?: string
          campus?: string
          accessibility?: boolean
          equipment?: any
          status?: string
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      room_features: {
        Row: {
          id: string
          name: string
          description: string | null
          category: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          category?: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          category?: string
          created_at?: string
        }
      }
      room_feature_assignments: {
        Row: {
          id: string
          room_id: string
          feature_id: string
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          room_id: string
          feature_id: string
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          room_id?: string
          feature_id?: string
          notes?: string | null
          created_at?: string
        }
      }
      room_availability: {
        Row: {
          id: string
          room_id: string
          block_type: string
          start_datetime: string
          end_datetime: string
          reason: string | null
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          room_id: string
          block_type?: string
          start_datetime: string
          end_datetime: string
          reason?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          room_id?: string
          block_type?: string
          start_datetime?: string
          end_datetime?: string
          reason?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      instructor_availability: {
        Row: {
          id: string
          instructor_id: string
          day_of_week: number
          start_time: string
          end_time: string
          availability_type: string
          effective_date: string
          expiry_date: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          instructor_id: string
          day_of_week: number
          start_time: string
          end_time: string
          availability_type?: string
          effective_date: string
          expiry_date?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          instructor_id?: string
          day_of_week?: number
          start_time?: string
          end_time?: string
          availability_type?: string
          effective_date?: string
          expiry_date?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      course_sections: {
        Row: {
          id: string
          code: string
          module_id: string
          semester_id: string
          instructor_id: string | null
          capacity: number
          enrolled_count: number
          session_type: string
          delivery_mode: string
          required_room_type: string | null
          required_features: any
          duration_minutes: number
          meetings_per_week: number
          consecutive_sessions: boolean
          max_daily_sessions: number | null
          preferred_days: number[]
          blocked_days: number[]
          preferred_times: string[]
          blocked_times: string[]
          student_group_id: string | null
          department_id: string | null
          notes: string | null
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          code: string
          module_id: string
          semester_id: string
          instructor_id?: string | null
          capacity?: number
          enrolled_count?: number
          session_type?: string
          delivery_mode?: string
          required_room_type?: string | null
          required_features?: any
          duration_minutes?: number
          meetings_per_week?: number
          consecutive_sessions?: boolean
          max_daily_sessions?: number | null
          preferred_days?: number[]
          blocked_days?: number[]
          preferred_times?: string[]
          blocked_times?: string[]
          student_group_id?: string | null
          department_id?: string | null
          notes?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          code?: string
          module_id?: string
          semester_id?: string
          instructor_id?: string | null
          capacity?: number
          enrolled_count?: number
          session_type?: string
          delivery_mode?: string
          required_room_type?: string | null
          required_features?: any
          duration_minutes?: number
          meetings_per_week?: number
          consecutive_sessions?: boolean
          max_daily_sessions?: number | null
          preferred_days?: number[]
          blocked_days?: number[]
          preferred_times?: string[]
          blocked_times?: string[]
          student_group_id?: string | null
          department_id?: string | null
          notes?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
      course_section_meetings: {
        Row: {
          id: string
          section_id: string
          meeting_index: number
          day_of_week: number
          start_time: string
          end_time: string
          duration_minutes: number
          room_id: string | null
          instructor_id: string | null
          is_fixed: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          section_id: string
          meeting_index: number
          day_of_week: number
          start_time: string
          end_time: string
          duration_minutes: number
          room_id?: string | null
          instructor_id?: string | null
          is_fixed?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          section_id?: string
          meeting_index?: number
          day_of_week?: number
          start_time?: string
          end_time?: string
          duration_minutes?: number
          room_id?: string | null
          instructor_id?: string | null
          is_fixed?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      student_groups: {
        Row: {
          id: string
          name: string
          code: string
          description: string | null
          program_id: string | null
          department_id: string | null
          cohort_year: number | null
          semester: number | null
          total_students: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          code: string
          description?: string | null
          program_id?: string | null
          department_id?: string | null
          cohort_year?: number | null
          semester?: number | null
          total_students?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          code?: string
          description?: string | null
          program_id?: string | null
          department_id?: string | null
          cohort_year?: number | null
          semester?: number | null
          total_students?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      cohort_members: {
        Row: {
          id: string
          group_id: string
          student_id: string
          created_at: string
        }
        Insert: {
          id?: string
          group_id: string
          student_id: string
          created_at?: string
        }
        Update: {
          id?: string
          group_id?: string
          student_id?: string
          created_at?: string
        }
      }
      academic_days: {
        Row: {
          id: string
          day_of_week: number
          name: string
          abbreviation: string
          is_teaching_day: boolean
          created_at: string
        }
        Insert: {
          id?: string
          day_of_week: number
          name: string
          abbreviation: string
          is_teaching_day?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          day_of_week?: number
          name?: string
          abbreviation?: string
          is_teaching_day?: boolean
          created_at?: string
        }
      }
      time_slots: {
        Row: {
          id: string
          slot_index: number
          day_of_week: number
          start_time: string
          end_time: string
          slot_duration: number
          is_break: boolean
          break_name: string | null
          created_at: string
        }
        Insert: {
          id?: string
          slot_index: number
          day_of_week: number
          start_time: string
          end_time: string
          slot_duration: number
          is_break?: boolean
          break_name?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          slot_index?: number
          day_of_week?: number
          start_time?: string
          end_time?: string
          slot_duration?: number
          is_break?: boolean
          break_name?: string | null
          created_at?: string
        }
      }
      holidays: {
        Row: {
          id: string
          name: string
          start_date: string
          end_date: string
          block_type: string
          affects_scheduling: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          start_date: string
          end_date: string
          block_type?: string
          affects_scheduling?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          start_date?: string
          end_date?: string
          block_type?: string
          affects_scheduling?: boolean
          created_at?: string
        }
      }
      timetable_runs: {
        Row: {
          id: string
          semester_id: string
          status: string
          started_at: string | null
          completed_at: string | null
          progress: number
          courses_count: number
          sections_count: number
          assignments_count: number
          hard_violations: number
          soft_score: number | null
          error_message: string | null
          metadata: any
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          semester_id: string
          status?: string
          started_at?: string | null
          completed_at?: string | null
          progress?: number
          courses_count?: number
          sections_count?: number
          assignments_count?: number
          hard_violations?: number
          soft_score?: number | null
          error_message?: string | null
          metadata?: any
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          semester_id?: string
          status?: string
          started_at?: string | null
          completed_at?: string | null
          progress?: number
          courses_count?: number
          sections_count?: number
          assignments_count?: number
          hard_violations?: number
          soft_score?: number | null
          error_message?: string | null
          metadata?: any
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      timetable_versions: {
        Row: {
          id: string
          semester_id: string
          run_id: string | null
          version_number: number
          label: string | null
          status: string
          is_published: boolean
          published_at: string | null
          published_by: string | null
          notes: string | null
          metadata: any
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          semester_id: string
          run_id?: string | null
          version_number: number
          label?: string | null
          status?: string
          is_published?: boolean
          published_at?: string | null
          published_by?: string | null
          notes?: string | null
          metadata?: any
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          semester_id?: string
          run_id?: string | null
          version_number?: number
          label?: string | null
          status?: string
          is_published?: boolean
          published_at?: string | null
          published_by?: string | null
          notes?: string | null
          metadata?: any
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      timetable_assignments: {
        Row: {
          id: string
          version_id: string
          run_id: string | null
          section_id: string
          meeting_id: string | null
          room_id: string
          instructor_id: string | null
          day_of_week: number
          start_time: string
          end_time: string
          start_date: string
          end_date: string
          is_override: boolean
          override_reason: string | null
          override_by: string | null
          override_at: string | null
          metadata: any
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          version_id: string
          run_id?: string | null
          section_id: string
          meeting_id?: string | null
          room_id: string
          instructor_id?: string | null
          day_of_week: number
          start_time: string
          end_time: string
          start_date: string
          end_date: string
          is_override?: boolean
          override_reason?: string | null
          override_by?: string | null
          override_at?: string | null
          metadata?: any
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          version_id?: string
          run_id?: string | null
          section_id?: string
          meeting_id?: string | null
          room_id?: string
          instructor_id?: string | null
          day_of_week?: number
          start_time?: string
          end_time?: string
          start_date?: string
          end_date?: string
          is_override?: boolean
          override_reason?: string | null
          override_by?: string | null
          override_at?: string | null
          metadata?: any
          created_at?: string
          updated_at?: string
        }
      }
      timetable_conflicts: {
        Row: {
          id: string
          version_id: string
          run_id: string | null
          conflict_type: string
          severity: string
          assignment_a_id: string
          assignment_b_id: string
          description: string
          resolution: string | null
          resolved_at: string | null
          resolved_by: string | null
          created_at: string
        }
        Insert: {
          id?: string
          version_id: string
          run_id?: string | null
          conflict_type: string
          severity?: string
          assignment_a_id: string
          assignment_b_id: string
          description: string
          resolution?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          version_id?: string
          run_id?: string | null
          conflict_type?: string
          severity?: string
          assignment_a_id?: string
          assignment_b_id?: string
          description?: string
          resolution?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          created_at?: string
        }
      }
      timetable_scores: {
        Row: {
          id: string
          run_id: string
          version_id: string | null
          overall_score: number
          hard_violation_count: number
          soft_violation_count: number
          student_gap_score: number
          instructor_gap_score: number
          room_utilization_score: number
          building_change_score: number
          preference_score: number
          details: any
          created_at: string
        }
        Insert: {
          id?: string
          run_id: string
          version_id?: string | null
          overall_score: number
          hard_violation_count?: number
          soft_violation_count?: number
          student_gap_score?: number
          instructor_gap_score?: number
          room_utilization_score?: number
          building_change_score?: number
          preference_score?: number
          details?: any
          created_at?: string
        }
        Update: {
          id?: string
          run_id?: string
          version_id?: string | null
          overall_score?: number
          hard_violation_count?: number
          soft_violation_count?: number
          student_gap_score?: number
          instructor_gap_score?: number
          room_utilization_score?: number
          building_change_score?: number
          preference_score?: number
          details?: any
          created_at?: string
        }
      }
      timetable_constraints: {
        Row: {
          id: string
          name: string
          constraint_type: string
          is_enabled: boolean
          weight: number
          parameters: any
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          constraint_type: string
          is_enabled?: boolean
          weight?: number
          parameters?: any
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          constraint_type?: string
          is_enabled?: boolean
          weight?: number
          parameters?: any
          description?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      timetable_preferences: {
        Row: {
          id: string
          name: string
          weight: number
          is_enabled: boolean
          parameters: any
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          weight: number
          is_enabled?: boolean
          parameters?: any
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          weight?: number
          is_enabled?: boolean
          parameters?: any
          description?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}

export type News = Database['public']['Tables']['News']['Row']
export type Event = Database['public']['Tables']['Event']['Row']
export type AuditLog = Database['public']['Tables']['AuditLog']['Row']
export type Module = Database['public']['Tables']['modules']['Row']
export type ClassSchedule = Database['public']['Tables']['class_schedules']['Row']
export type ClassSession = Database['public']['Tables']['class_sessions']['Row']
export type ModuleEnrollment = Database['public']['Tables']['module_enrollments']['Row']
export type Student = Database['public']['Tables']['students']['Row']
export type Profile = Database['public']['Tables']['profiles']['Row']
export type DocumentRecord = Database['public']['Tables']['document_records']['Row']

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

export type ApplicationStatus = 'DRAFT' | 'SUBMITTED' | 'UNDER_REVIEW' | 'REJECTED' | 'DOCS_REQUIRED' | 'ADMITTED' | 'OFFER_ACCEPTED' | 'PAYMENT_SUBMITTED' | 'ENROLLED';

export type Application = {
  id: string;
  user_id: string;
  course_id: string;
  intake?: string;
  status: ApplicationStatus;
  personal_info: {
    firstName: string;
    middleName?: string;
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

export type Room = Database['public']['Tables']['rooms']['Row']
export type RoomFeature = Database['public']['Tables']['room_features']['Row']
export type RoomFeatureAssignment = Database['public']['Tables']['room_feature_assignments']['Row']
export type RoomAvailability = Database['public']['Tables']['room_availability']['Row']
export type InstructorAvailability = Database['public']['Tables']['instructor_availability']['Row']
export type CourseSection = Database['public']['Tables']['course_sections']['Row']
export type CourseSectionMeeting = Database['public']['Tables']['course_section_meetings']['Row']
export type StudentGroup = Database['public']['Tables']['student_groups']['Row']
export type CohortMember = Database['public']['Tables']['cohort_members']['Row']
export type AcademicDay = Database['public']['Tables']['academic_days']['Row']
export type TimeSlot = Database['public']['Tables']['time_slots']['Row']
export type Holiday = Database['public']['Tables']['holidays']['Row']
export type TimetableRun = Database['public']['Tables']['timetable_runs']['Row']
export type TimetableVersion = Database['public']['Tables']['timetable_versions']['Row']
export type TimetableAssignment = Database['public']['Tables']['timetable_assignments']['Row']
export type TimetableConflict = Database['public']['Tables']['timetable_conflicts']['Row']
export type TimetableScore = Database['public']['Tables']['timetable_scores']['Row']
export type TimetableConstraint = Database['public']['Tables']['timetable_constraints']['Row']
export type TimetablePreference = Database['public']['Tables']['timetable_preferences']['Row']

export type SessionType = 'LECTURE' | 'LAB' | 'SEMINAR' | 'TUTORIAL' | 'PRACTICAL' | 'CLINICAL' | 'ONLINE' | 'HYBRID'
export type DeliveryMode = 'IN_PERSON' | 'ONLINE' | 'HYBRID' | 'SYNC_ONLINE'
export type RoomType = 'LECTURE_ROOM' | 'LAB' | 'COMPUTER_LAB' | 'SCIENCE_LAB' | 'SEMINAR_ROOM' | 'AUDITORIUM' | 'CLINICAL_LAB' | 'SPECIALIZED_ROOM' | 'ONLINE'
export type TimetableStatus = 'DRAFT' | 'UNDER_REVIEW' | 'APPROVED' | 'PUBLISHED' | 'ARCHIVED'
export type RunStatus = 'PENDING' | 'RUNNING' | 'COMPLETED' | 'PARTIAL' | 'FAILED' | 'CANCELLED'
export type ConflictSeverity = 'HARD' | 'SOFT'
export const DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] as const
export type DayOfWeek = typeof DAYS_OF_WEEK[number]
