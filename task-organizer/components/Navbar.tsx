'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Navbar = () => {
    const pathname = usePathname();

    return (
        <nav className="w-full bg-white shadow-md py-4 px-6 flex justify-center">
            <div className="flex gap-6 text-lg font-semibold">
                <Link 
                    href="/" 
                    className={`px-4 py-2 rounded ${pathname === "/" ? "bg-gray-200" : "hover:bg-gray-100"}`}
                >
                    Tasks
                </Link>
                <Link 
                    href="/audio" 
                    className={`px-4 py-2 rounded ${pathname === "/audio" ? "bg-gray-200" : "hover:bg-gray-100"}`}
                >
                    Audio Import
                </Link>
            </div>
        </nav>
    );
};

export default Navbar;
