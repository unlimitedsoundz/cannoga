import { createStaticClient } from '@/lib/supabase/static';

export default async function DebugPage() {
    const supabase = createStaticClient();

    const { data: schools } = await supabase.from('School').select('*');
    const { data: departments } = await supabase.from('Department').select('*, school:School(name, slug)');

    return (
        <div className="p-8 font-mono text-sm">
            <h1 className="text-2xl font-bold mb-4">Database Debugger</h1>

            <div className="grid grid-cols-2 gap-8">
                <div>
                    <h2 className="text-xl font-bold mb-2">Schools ({schools?.length})</h2>
                    <pre className="bg-gray-100 p-4 rounded overflow-auto h-96">
                        {JSON.stringify(schools, null, 2)}
                    </pre>
                </div>

                <div>
                    <h2 className="text-xl font-bold mb-2">Departments ({departments?.length})</h2>
                    <pre className="bg-gray-100 p-4 rounded overflow-auto h-96">
                        {JSON.stringify(departments, null, 2)}
                    </pre>
                </div>
            </div>
        </div>
    );
}
