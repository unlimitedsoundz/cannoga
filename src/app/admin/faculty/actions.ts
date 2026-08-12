import { createClient } from '@/utils/supabase/client';

async function uploadFile(file: File, bucket: string = 'content') {
    if (!file || file.size === 0) return null;
    const supabase = createClient();
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${fileName}`;

    console.log('Admin Action: Uploading file to bucket:', bucket);

    const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file);

    if (uploadError) {
        console.error('Upload Error:', uploadError);
        throw new Error(`Upload failed: ${uploadError.message}`);
    }

    const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

    return publicUrl;
}

export async function createFaculty(formData: FormData) {
    console.log('Admin Action: Creating faculty member...');
    try {
        const supabase = createClient();
        const imageFile = formData.get('image') as File;

        let imageUrl = null;
        if (imageFile && imageFile.size > 0) {
            console.log('Uploading image...');
            imageUrl = await uploadFile(imageFile);
        }

        const facultyData = {
            name: formData.get('name') as string,
            role: formData.get('role') as string,
            bio: formData.get('bio') as string,
            email: formData.get('email') as string,
            schoolId: formData.get('schoolId') as string,
            departmentId: (formData.get('departmentId') as string) || null,
            imageUrl,
        };
        console.log('Inserting faculty data:', facultyData);

        const { error } = await supabase.from('Faculty').insert(facultyData);

        if (error) {
            console.error('Supabase Insert Error:', error);
            throw new Error(`Database insert failed: ${error.message}`);
        }
    } catch (e: any) {
        console.error('createFaculty Exception:', e);
        throw e;
    }

    return { success: true };
}

export async function updateFaculty(id: string, formData: FormData) {
    console.log(`Admin Action: Updating faculty member ${id}...`);
    try {
        const supabase = createClient();
        const imageFile = formData.get('image') as File;

        let imageUrl = null;
        if (imageFile && imageFile.size > 0) {
            console.log('Uploading new image...');
            imageUrl = await uploadFile(imageFile);
        }

        const updateData: any = {
            name: formData.get('name') as string,
            role: formData.get('role') as string,
            bio: formData.get('bio') as string,
            email: formData.get('email') as string,
            schoolId: formData.get('schoolId') as string,
            departmentId: (formData.get('departmentId') as string) || null,
        };

        if (imageUrl) updateData.imageUrl = imageUrl;

        console.log('Updating faculty data:', updateData);

        const { error } = await supabase.from('Faculty').update(updateData).eq('id', id);

        if (error) {
            console.error('Supabase Update Error:', error);
            throw new Error(`Database update failed: ${error.message}`);
        }
    } catch (e: any) {
        console.error('updateFaculty Exception:', e);
        throw e;
    }

    return { success: true };
}
