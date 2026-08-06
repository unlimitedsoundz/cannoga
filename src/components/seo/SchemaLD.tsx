import React from 'react';

interface SchemaLDProps {
    data: Record<string, any>;
}

export function SchemaLD({ data }: SchemaLDProps) {
    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
    );
}
