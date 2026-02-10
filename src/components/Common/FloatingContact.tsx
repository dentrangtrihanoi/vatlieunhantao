"use client";
import React, { useState } from "react";
import Link from "next/link";

const FloatingContact = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const contactOptions = [
        {
            label: "Zalo",
            href: "https://zalo.me/",
            bg: "bg-[#0068FF]",
            icon: (
                <svg width="24" height="24" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 0H48V48H0V0Z" fill="none" />
                    <path d="M19.96 23.36C19.96 23.36 17.5 24.38 16.5 24C15.5 23.62 12.8 22.82 12.8 22.82C12.8 22.82 11.3 22.38 12.4 21.3C13.5 20.22 17.5 16.72 17.5 16.72C17.5 16.72 20.5 14.22 23.5 16.22C26.5 18.22 36.5 23.22 36.5 23.22C36.5 23.22 39.5 25.22 38.5 27.22C37.5 29.22 35.5 32.22 35.5 32.22C35.5 32.22 34.5 34.22 32.5 33.22C30.5 32.22 25.5 29.22 25.5 29.22C25.5 29.22 23.5 27.22 23.5 26.22" fill="white" />
                    <path d="M22 13C22 13 24 13 25 14" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            ), // Simplified Zalo-like or Chat Icon
            customIcon: (
                <svg width="24" height="24" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13.73 24.79C13.73 17.84 21.75 13.9 33.66 13.9C57.49 13.9 76.5 26.15 76.5 45C76.5 63.85 57.49 76.1 33.66 76.1C30.93 76.1 24.96 75.32 24.96 75.32L17.21 79.5C17.21 79.5 12.21 82 12.21 77C12.21 76.5 12.23 72.8 12.23 70.08C8.5 65 5.5 58.5 5.5 50.8C5.5 39.7 13.73 34.03 13.73 24.79Z" fill="white" />
                    <text x="30" y="65" fill="#0068FF" fontSize="35" fontWeight="bold">Z</text>
                </svg>
            )

        },
        {
            label: "Facebook",
            href: "https://facebook.com/",
            bg: "bg-[#1877F2]",
            icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                    <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24V15.563H7.078V12.073H10.125V9.429C10.125 6.423 11.916 4.764 14.657 4.764C15.97 4.764 17.344 4.999 17.344 4.999V7.951H15.83C14.34 7.951 13.875 8.875 13.875 9.823V12.073H17.203L16.67 15.563H13.875V24C19.612 23.094 24 18.1 24 12.073Z" />
                </svg>
            ),
        },
        {
            label: "Call",
            href: "tel:0123456789",
            bg: "bg-[#4CAF50]",
            icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22 16.92V19.92C22.0011 20.1986 21.9441 20.4742 21.8325 20.7294C21.7209 20.9846 21.5573 21.2137 21.3521 21.402C21.1468 21.5902 20.9046 21.7336 20.6407 21.8228C20.3769 21.912 20.0974 21.9452 19.82 21.92C16.7428 21.5857 13.787 20.5342 11.19 18.84C8.77382 17.2459 6.72533 15.1974 5.13 12.78C3.42697 10.1866 2.37326 7.23614 2.04 4.16C2.01483 3.88265 2.04797 3.60318 2.1372 3.33939C2.22644 3.0756 2.36982 2.83339 2.55806 2.62817C2.7463 2.42295 2.97526 2.2594 3.23049 2.14801C3.48572 2.03662 3.7614 1.97983 4.04 1.98H7.04C7.50294 1.97524 7.9535 2.13626 8.30403 2.43209C8.65457 2.72793 8.87995 3.13768 8.937 3.585C9.0435 4.39121 9.24042 5.18341 9.52 5.95C9.63236 6.25521 9.65675 6.58475 9.59024 6.90045C9.52373 7.21615 9.36912 7.50502 9.144 7.733L7.36 9.52C9.36868 13.0645 12.2955 15.9913 15.84 18L17.63 16.21C17.8576 15.9845 18.1464 15.8299 18.4622 15.7634C18.778 15.6969 19.1077 15.7214 19.413 15.834C20.1796 16.1136 20.9718 16.3105 21.778 16.417C22.2305 16.4764 22.6429 16.708 22.9385 17.0664C23.2341 17.4248 23.3918 17.8845 23.38 18.35L22 16.92Z" />
                </svg>
            ),
        },
    ];

    return (
        <div className="fixed bottom-28 right-6 z-[999] flex flex-col items-end gap-3 group">
            {/* Desktop View - Always Visible */}
            <div className="hidden md:flex flex-col gap-3">
                {contactOptions.map((option, index) => (
                    <Link
                        key={index}
                        href={option.href}
                        target="_blank"
                        className={`${option.bg} w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-200 text-white`}
                        title={option.label}
                    >
                        {option.label === "Zalo" ? <div className="p-1.5 font-bold text-xs flex items-center justify-center w-full h-full">Zalo</div> : option.icon}
                    </Link>
                ))}
            </div>

            {/* Mobile View - Floating Action Button */}
            <div className="md:hidden relative flex flex-col-reverse items-end gap-3">
                {/* Main Toggle Button */}
                <button
                    onClick={toggleMenu}
                    className="w-14 h-14 rounded-full bg-blue text-white shadow-xl flex items-center justify-center hover:bg-dark ease-out duration-200"
                    aria-label="Contact Menu"
                >
                    {isOpen ? (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    ) : (
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                        </svg>
                    )}
                </button>

                {/* Mobile Options (Expandable) */}
                <div
                    className={`flex flex-col gap-3 transition-all duration-300 origin-bottom ${isOpen ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-10 scale-0 pointer-events-none absolute bottom-16 right-0"
                        }`}
                >
                    {contactOptions.map((option, index) => (
                        <Link
                            key={index}
                            href={option.href}
                            target="_blank"
                            className={`${option.bg} w-12 h-12 rounded-full flex items-center justify-center shadow-lg text-white mb-2`}
                            onClick={() => setIsOpen(false)}
                            title={option.label}
                        >
                            {option.label === "Zalo" ? <div className="p-1.5 font-bold text-xs flex items-center justify-center w-full h-full">Zalo</div> : option.icon}
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FloatingContact;
