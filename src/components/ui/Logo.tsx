import { Link } from "@aalto-dx/react-components"
import Image from "next/image"

export function Logo({ className = "", onClick }: { className?: string, onClick?: () => void }) {
    const isDarkBackground = className.includes('text-white') || className.includes('brightness-0');

    return (
        <Link
            href="/"
            className={`flex items-center gap-2 group ${className}`}
            onClick={onClick}
        >
            <div className={`relative h-full transition-all duration-300 ${isDarkBackground ? 'brightness-0 invert' : ''}`}>

                <Image
                    src="/images/logo-cannoga.png"
                    alt="Cannoga College"
                    width={150}
                    height={150}
                    className="object-contain w-auto h-full"
                    priority
                />
            </div>
        </Link>
    )
}
