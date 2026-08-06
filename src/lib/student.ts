import { createServerClient } from '@/utils/supabase/server'

/**
 * Fetches all student IDs from the profiles table.
 * @param idColumn - The column name containing the student ID (default: 'student_id')
 * @returns Promise<string[]> Array of student IDs
 * @throws Error if the query fails
 */
export async function getAllStudentIds(idColumn: string = 'student_id'): Promise<string[]> {
  const supabase = await createServerClient()
  
  const { data, error } = await supabase
    .from('profiles')
    .select(idColumn)
    .not(idColumn, 'is', null)
    
  if (error) {
    throw new Error(`Failed to fetch student IDs: ${error.message}`)
  }
  
  // Extract the ID values from the returned objects
  return data.map((row: Record<string, any>) => row[idColumn] as string)
}

/**
 * Alternative function that allows specifying both table and column names
 * @param table - Table name (default: 'profiles')
 * @param idColumn - Column name containing student ID (default: 'student_id')
 * @returns Promise<string[]> Array of student IDs
 */
export async function getStudentIdsFromTable(
  table: string = 'profiles',
  idColumn: string = 'student_id'
): Promise<string[]> {
  const supabase = await createServerClient()
  
  const { data, error } = await supabase
    .from(table)
    .select(idColumn)
    .not(idColumn, 'is', null)
    
  if (error) {
    throw new Error(`Failed to fetch student IDs from ${table}: ${error.message}`)
  }
  
  return data.map((row: Record<string, any>) => row[idColumn] as string)
}