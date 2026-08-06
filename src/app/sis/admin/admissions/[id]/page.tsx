import { redirect } from 'next/navigation';

export default async function AdmissionIdPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  redirect(`/sis/admin/admissions/${id}/application`);
}
