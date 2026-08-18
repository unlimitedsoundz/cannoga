export interface FlipbookPageMeta {
    pageNumber: number;
    title: string;
    section: string;
    subtitle?: string;
    image: string;
    thumbnail: string;
    width: number;
    height: number;
    aspectRatio: number;
    fullText?: string;
}

export interface Publication {
    id: string;
    title: string;
    edition: string;
    slug: string;
    description: string;
    pdfUrl: string;
    coverImage: string;
    ogImage: string;
    totalPages: number;
    published: boolean;
    publishedAt: string;
    pages: FlipbookPageMeta[];
}

export interface SearchResult {
    pageNumber: number;
    pageTitle: string;
    section: string;
    snippet: string;
    matchesCount: number;
}

export type FlipOrientation = 'portrait' | 'landscape';

export type ZoomLevel = 0.75 | 1.0 | 1.25 | 1.5 | 2.0;

export interface FlipbookEventPayload {
    currentPage: number;
    totalPages: number;
    orientation: FlipOrientation;
    isFirstPage: boolean;
    isLastPage: boolean;
    spreadPages: number[];
}
