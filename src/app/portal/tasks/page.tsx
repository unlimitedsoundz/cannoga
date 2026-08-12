import { createServiceRoleClient } from '@/utils/supabase/server-admin';
import { StudentTask } from '@/utils/tasks';

export default async function TasksPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Your Tasks</h1>
        <p className="text-sm text-gray-600 mt-1">
          View and manage your tasks and to-do items.
        </p>
      </div>

      <TasksClient />
    </div>
  );
}

async function TasksClient() {
  const supabase = createServiceRoleClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Please log in to view your tasks.</p>
      </div>
    );
  }

  const { data: student } = await supabase
    .from('students')
    .select('id')
    .eq('user_id', user.id)
    .single();

  if (!student) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Student record not found.</p>
      </div>
    );
  }

  const { getStudentTasks } = await import('@/utils/tasks');
  const tasks = await getStudentTasks(student.id);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {tasks.length === 0 ? (
        <div className="p-6 text-center">
          <p className="text-gray-500">No tasks at this time.</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-200">
          {tasks.map((task: StudentTask) => (
            <div key={task.id} className="p-4 flex items-start justify-between">
              <div className="space-y-1">
                <h3 className="text-sm font-medium text-gray-900">{task.title}</h3>
                <p className="text-sm text-gray-600">{task.description}</p>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                    task.priority === 'high' ? 'bg-red-100 text-red-800' :
                    task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {task.priority}
                  </span>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                    task.status === 'completed' ? 'bg-green-100 text-green-800' :
                    task.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                    task.status === 'cancelled' ? 'bg-gray-100 text-gray-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {task.status.replace(/_/g, ' ')}
                  </span>
                  {task.due_date && (
                    <span>Due: {new Date(task.due_date).toLocaleDateString()}</span>
                  )}
                </div>
              </div>
              {task.action_url && task.status !== 'completed' && (
                <a
                  href={task.action_url}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  {task.action_label || 'View'}
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
