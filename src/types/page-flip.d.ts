declare module 'page-flip' {
    export interface IFlipSetting {
        width: number;
        height: number;
        size?: 'fixed' | 'stretch';
        minWidth?: number;
        maxWidth?: number;
        minHeight?: number;
        maxHeight?: number;
        drawShadow?: boolean;
        maxShadowOpacity?: number;
        showCover?: boolean;
        mobileScrollSupport?: boolean;
        usePortrait?: boolean;
        startPage?: number;
        flippingTime?: number;
        useMouseEvents?: boolean;
        swipeDistance?: number;
        showPageCorners?: boolean;
        autoSize?: boolean;
    }

    export class PageFlip {
        constructor(inContent: HTMLElement, setting: Partial<IFlipSetting>);
        loadFromHTML(items: NodeListOf<HTMLElement> | HTMLElement[]): void;
        loadFromImages(images: string[]): void;
        destroy(): void;
        turnToPage(pageNum: number): void;
        turnToNextPage(): void;
        turnToPrevPage(): void;
        flipNext(corner?: string): void;
        flipPrev(corner?: string): void;
        flip(pageNum: number, corner?: string): void;
        getCurrentPageIndex(): number;
        getPageCount(): number;
        getOrientation(): 'portrait' | 'landscape';
        getState(): string;
        on(event: string, callback: (e: any) => void): void;
        off(event: string, callback?: (e: any) => void): void;
        update(): void;
    }
}
