import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(url, key);

const ESCAPED_DOUBLE = /\\(\\")+/g;
const ESCAPED_NEWLINE = /\\n/g;
const DOUBLE_SLASH = /\\\\/g;

function unescapeDeep(str: string): string {
    let current = str;
    let previous = "";

    while (current !== previous) {
        previous = current;
        current = current.replace(/^(\\)*\\""/, "").replace(/\\\"$/, "");
        current = current.replace(/\\\(\\)*\\"/g, '"');
        current = current.replace(/\\n/g, "\n");
        current = current.replace(/\\\\/g, "\\");
    }

    return current;
}

    return current;
}

async function main() {
    const { data: courses, error } = await supabase.from("Course").select("id, slug, sections");
    if (error) {
        console.error("Failed to fetch courses", error);
        process.exit(1);
    }

    const updates = [];
    for (const course of courses ?? []) {
        const sections = (course.sections as any[]) ?? [];
        let changed = false;
        const newSections = sections.map((s) => {
            const id = unescapeDeep(s.id);
            const title = unescapeDeep(s.title);
            const content = unescapeDeep(s.content ?? "");
            if (id !== s.id || title !== s.title || content !== s.content) {
                changed = true;
            }
            return { ...s, id, title, content };
        });

        if (changed) {
            updates.push({ id: course.id, sections: newSections, slug: course.slug });
        }
    }

    console.log(`Updating ${updates.length} courses...`);
    for (const update of updates) {
        const { error } = await supabase.from("Course").update({ sections: update.sections }).eq("id", update.id);
        if (error) {
            console.error("Failed to update", update.slug, error);
        } else {
            console.log("Updated", update.slug);
        }
    }
}

main().catch(console.error);
