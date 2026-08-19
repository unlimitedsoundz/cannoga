// ============================================================
// Cannoga College — Student Housing & Residence Life Types
// ============================================================

export type ResidenceStyle = 'traditional_dorm' | 'suite_style' | 'townhouse' | 'deluxe_studio' | 'homestay';
export type RoomStatus = 'AVAILABLE' | 'OCCUPIED' | 'MAINTENANCE' | 'reserved';
export type HousingAppStatus = 'draft' | 'submitted' | 'room_selected' | 'contract_signed' | 'deposit_paid' | 'confirmed' | 'cancelled';
export type WorkOrderUrgency = 'low' | 'standard' | 'urgent' | 'emergency';
export type WorkOrderStatus = 'open' | 'assigned' | 'in_progress' | 'resolved' | 'closed';
export type HousingType = 'on_campus' | 'homestay';
export type GenderPolicy = 'any' | 'male_only' | 'female_only';
export type GenderPreference = 'any' | 'same_gender' | 'co_ed';
export type FloorTypePreference = 'quiet_study' | 'social' | 'any';

// -------------------------------------------------------
// Residence Buildings
// -------------------------------------------------------
export interface ResidenceBuilding {
    id: string;
    name: string;
    code: string | null;
    campus_location: string;
    style: ResidenceStyle | null;
    total_floors: number;
    total_beds: number;
    amenities: string[];
    description: string | null;
    services: string[] | null;
    image_url: string | null;
    main_images: string[] | null;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    // Computed
    available_beds?: number;
    occupied_beds?: number;
    total_rooms?: number;
}

// -------------------------------------------------------
// Residence Rooms & Beds
// -------------------------------------------------------
export interface ResidenceRoom {
    id: string;
    building_id: string;
    floor_number: number;
    suite_number: string | null;
    room_number: string;
    bed_identifier: string | null;
    full_room_code: string | null;
    room_type_label: string | null;
    room_type: string | null;
    price_per_term_minor: number | null;
    monthly_rate: number;
    status: RoomStatus;
    window_orientation: string | null;
    is_accessible: boolean;
    capacity: number;
    size: string | null;
    images: string[] | null;
    created_at: string;
    updated_at: string;
    // Relations
    building?: Pick<ResidenceBuilding, 'id' | 'name' | 'code'>;
}

// -------------------------------------------------------
// Meal Plans
// -------------------------------------------------------
export interface MealPlan {
    id: string;
    code: string;
    title: string;
    description: string | null;
    price_per_term_minor: number;
    flex_dollars_minor: number;
    meals_per_week: number | null;
    is_active: boolean;
    created_at: string;
}

// -------------------------------------------------------
// Homestay Hosts
// -------------------------------------------------------
export interface HomestayHost {
    id: string;
    host_name: string;
    host_family_description: string | null;
    address_city: string;
    distance_to_campus_km: number;
    languages_spoken: string[];
    dietary_accommodations: string[];
    max_students: number;
    current_students: number;
    price_per_week_minor: number;
    gender_policy: GenderPolicy;
    has_quiet_study_room: boolean;
    is_active: boolean;
    photo_url: string | null;
    host_photo_url: string | null;
    created_at: string;
    // Computed
    spots_available?: number;
}

// -------------------------------------------------------
// Roommate Profile
// -------------------------------------------------------
export interface RoommateProfile {
    student_id: string;
    sleep_schedule: 'early' | 'moderate' | 'night';
    study_habits: 'silent' | 'music' | 'social';
    cleanliness_rating: 1 | 2 | 3 | 4 | 5;
    guest_preference: 'rarely' | 'advance_notice' | 'frequent';
    gender_preference: GenderPreference;
    floor_type_preference: FloorTypePreference;
    dietary_needs: string[];
    requested_friend_student_ids: string[];
    hobbies: string | null;
    bio: string | null;
    requested_roommate_student_id: string | null;
    updated_at: string;
    // Computed
    compatibility_score?: number;
    display_name?: string;
    student_id_display?: string;
}

// -------------------------------------------------------
// Housing Application
// -------------------------------------------------------
export interface HousingApplication {
    id: string;
    student_id: string;
    academic_year: string;
    term: string | null;
    building_id: string | null;
    assigned_room_id: string | null;
    selected_meal_plan_id: string | null;
    deposit_invoice_id: string | null;
    rent_invoice_id: string | null;
    signature_name: string | null;
    signed_at: string | null;
    move_in_date: string | null;
    move_out_date: string | null;
    special_accommodations: string | null;
    status: HousingAppStatus;
    housing_type: HousingType;
    homestay_host_id: string | null;
    priority_score: number;
    notes: string | null;
    created_at: string;
    updated_at: string;
    // Relations
    building?: Pick<ResidenceBuilding, 'id' | 'name' | 'code' | 'campus_location'>;
    assigned_room?: ResidenceRoom;
    meal_plan?: MealPlan;
    homestay_host?: HomestayHost;
    student?: {
        id: string;
        first_name: string;
        last_name: string;
        email: string;
        student_number: string;
    };
}

// -------------------------------------------------------
// Work Orders
// -------------------------------------------------------
export interface WorkOrder {
    id: string;
    ticket_number: string;
    student_id: string;
    room_id: string | null;
    category: 'heating_ac' | 'plumbing' | 'electrical' | 'furniture_locks' | 'internet' | 'other';
    urgency: WorkOrderUrgency;
    description: string;
    photo_urls: string[];
    status: WorkOrderStatus;
    assigned_technician: string | null;
    resolution_notes: string | null;
    resolved_at: string | null;
    created_at: string;
    updated_at: string;
    // Relations
    room?: Pick<ResidenceRoom, 'id' | 'room_number' | 'full_room_code'>;
}

// -------------------------------------------------------
// Move-In Inspection
// -------------------------------------------------------
export interface ChecklistItem {
    condition: 'good' | 'fair' | 'poor' | 'damaged';
    notes?: string;
}

export interface MoveInChecklist {
    desk: ChecklistItem['condition'];
    mattress: ChecklistItem['condition'];
    closet: ChecklistItem['condition'];
    window: ChecklistItem['condition'];
    smoke_detector: ChecklistItem['condition'];
    heating: ChecklistItem['condition'];
    door_lock?: ChecklistItem['condition'];
    bathroom?: ChecklistItem['condition'];
}

export interface MoveInInspection {
    id: string;
    application_id: string;
    student_id: string;
    room_id: string | null;
    checklist_items: MoveInChecklist;
    student_comments: string | null;
    student_signed_at: string;
    don_verified_at: string | null;
    don_staff_id: string | null;
}

// -------------------------------------------------------
// Guest Passes
// -------------------------------------------------------
export interface GuestPass {
    id: string;
    student_id: string;
    application_id: string;
    guest_full_name: string;
    arrival_date: string;
    departure_date: string;
    status: 'registered' | 'checked_in' | 'checked_out' | 'cancelled';
    created_at: string;
}

// -------------------------------------------------------
// Admin Occupancy Summary
// -------------------------------------------------------
export interface OccupancySummary {
    total_beds: number;
    occupied_beds: number;
    available_beds: number;
    maintenance_beds: number;
    occupancy_rate: number;
    homestay_placements: number;
    deposits_collected: number;
    open_work_orders: number;
    urgent_work_orders: number;
    pending_applications: number;
    buildings: Array<{
        id: string;
        name: string;
        code: string | null;
        total_beds: number;
        occupied: number;
        available: number;
        maintenance: number;
    }>;
}

// -------------------------------------------------------
// API Payloads
// -------------------------------------------------------
export interface ReserveRoomPayload {
    roomId: string;
    term: string;
    academicYear: string;
    housingType?: HousingType;
    homestayHostId?: string;
}

export interface SignContractPayload {
    applicationId: string;
    signatureName: string;
    mealPlanId: string | null;
    moveInDate: string;
    moveOutDate: string;
    specialAccommodations?: string;
}

export interface SubmitWorkOrderPayload {
    category: WorkOrder['category'];
    urgency: WorkOrderUrgency;
    description: string;
    roomId?: string;
    photoUrls?: string[];
}
