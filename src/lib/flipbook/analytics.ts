export interface ViewbookEvent {
    event: 'viewbook_opened' | 'page_viewed' | 'pdf_download' | 'search_performed' | 'viewbook_shared' | 'fullscreen_toggled';
    edition: string;
    pageNumber?: number;
    searchQuery?: string;
    shareMethod?: string;
    timestamp?: string;
}

export function trackViewbookEvent(event: ViewbookEvent): void {
    if (typeof window === 'undefined') return;

    try {
        const payload = {
            ...event,
            timestamp: new Date().toISOString(),
            url: window.location.href,
        };

        // Dispatch local event for any attached listeners
        window.dispatchEvent(new CustomEvent('cannoga_viewbook_event', { detail: payload }));

        // Log non-intrusively in development
        if (process.env.NODE_ENV === 'development') {
            console.log('[Viewbook Analytics]', payload);
        }
    } catch {
        // Silently continue
    }
}
