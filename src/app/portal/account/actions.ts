'use server';

import { createServerClient } from '@/utils/supabase/server';
import { createServiceRoleClient } from '@/utils/supabase/server-admin';

export async function signInWithEmailAndPassword(email: string, password: string) {
    const supabase = await createServerClient();

    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email.toLowerCase().trim(),
            password: password
        });

        if (error) {
            console.error('[AUTH] Login error:', error);
            return { error: error.message };
        }

        return { success: true, user: data.user };
    } catch (e: any) {
        console.error('[AUTH] Login network/system error:', e);
        return { error: e?.message || 'Network error. Please check your connection and try again.' };
    }
}

export async function registerApplicant(formData: {
    firstName: string;
    middleName?: string;
    lastName: string;
    country: string;
    email: string;
    dateOfBirth: string;
    password: string;
    phoneCode?: string;
    phoneNumber?: string;
    citizenship?: string;
    address?: string;
    city?: string;
    state?: string;
    zipcode?: string;
    passportNumber?: string;
    gender?: string;
    sameAsAbove?: boolean;
    localAddress?: string;
    localCity?: string;
    localCountry?: string;
    localState?: string;
    localZipcode?: string;
    is19OrOlder?: string;
    hasSiblingsAtCollege?: string;
    completingFormPerson?: string;
    housingRequired?: string;
    howDidYouHear?: string;
    questionsComments?: string;
    contactFirstName?: string;
    contactLastName?: string;
    contactPhone?: string;
    contactEmail?: string;
}) {
    const supabase = await createServerClient();

    const { data: userData, error: userError } = await supabase.auth.signUp({
        email: formData.email.toLowerCase().trim(),
        password: formData.password,
        options: {
            data: {
                first_name: formData.firstName,
                middle_name: formData.middleName || null,
                last_name: formData.lastName,
                country_of_residence: formData.country,
                date_of_birth: formData.dateOfBirth,
                role: 'APPLICANT',
                local_address: formData.localAddress || null,
                local_city: formData.localCity || null,
                local_country: formData.localCountry || null,
                local_state: formData.localState || null,
                local_zipcode: formData.localZipcode || null,
                is_19_or_older: formData.is19OrOlder || null,
                has_siblings_at_college: formData.hasSiblingsAtCollege || null,
                completing_form_person: formData.completingFormPerson || null,
                housing_required: formData.housingRequired || null,
                how_did_you_hear: formData.howDidYouHear || null,
                questions_comments: formData.questionsComments || null,
                contact_first_name: formData.contactFirstName || null,
                contact_last_name: formData.contactLastName || null,
                contact_phone: formData.contactPhone || null,
                contact_email: formData.contactEmail || null
            },
            emailRedirectTo: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000/portal/dashboard'
        }
    });

    if (userError) {
        console.error('User creation error:', userError);
        return { error: userError.message };
    }

    if (userData.user) {
        const adminClient = createServiceRoleClient();

        const { error: profileError } = await adminClient
            .from('profiles')
            .upsert({
                id: userData.user.id,
                email: formData.email.toLowerCase().trim(),
                first_name: formData.firstName,
                middle_name: formData.middleName || null,
                last_name: formData.lastName,
                country_of_residence: formData.country,
                date_of_birth: formData.dateOfBirth,
                role: 'APPLICANT',
                student_id: null,
                phone_code: formData.phoneCode,
                phone_number: formData.phoneNumber,
                citizenship: formData.citizenship,
                address: formData.address,
                city: formData.city,
                state_province: formData.state,
                zipcode: formData.zipcode,
                passport_number: formData.passportNumber,
                gender: formData.gender,
                local_address: formData.localAddress || null,
                local_city: formData.localCity || null,
                local_country: formData.localCountry || null,
                local_state_province: formData.localState || null,
                local_zipcode: formData.localZipcode || null,
                is_19_or_older: formData.is19OrOlder || null,
                has_siblings_at_college: formData.hasSiblingsAtCollege || null,
                completing_form_person: formData.completingFormPerson || null,
                housing_required: formData.housingRequired || null,
                how_did_you_hear: formData.howDidYouHear || null,
                questions_comments: formData.questionsComments || null,
                contact_first_name: formData.contactFirstName || null,
                contact_last_name: formData.contactLastName || null,
                contact_phone: formData.contactPhone || null,
                contact_email: formData.contactEmail || null
            }, {
                onConflict: 'id'
            });

        if (profileError) {
            console.error('Profile creation error:', profileError);
            return { error: `Account created, but profile setup failed: ${profileError.message}` };
        }

        const { data: profile } = await adminClient
            .from('profiles')
            .select('student_id')
            .eq('id', userData.user.id)
            .single();

        return {
            success: true,
            studentId: profile?.student_id
        };
    }

    return {
        success: true,
        message: 'Account created! Please check your email for verification.'
    };
}

export async function registerAdmin(formData: {
    firstName: string;
    lastName: string;
    email: string;
    dateOfBirth: string;
    password: string;
}) {
    const supabase = await createServerClient();

    const { error: userError } = await supabase.auth.signUp({
        email: formData.email.toLowerCase().trim(),
        password: formData.password,
        options: {
            data: {
                first_name: formData.firstName,
                last_name: formData.lastName,
                date_of_birth: formData.dateOfBirth,
                role: 'ADMIN'
            }
        }
    });

    if (userError) {
        console.error('Admin user creation error:', userError);
        return { error: userError.message };
    }

    return {
        success: true,
        message: 'Admin account created successfully! Please check your email for verification.'
    };
}

export async function updateAvatarUrl(url: string) {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error('Unauthorized');

    const { error } = await supabase
        .from('profiles')
        .update({
            avatar_url: url,
            updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

    if (error) {
        console.error('Error updating avatar URL:', error);
        throw new Error('Failed to update profile picture');
    }

    return { success: true };
}