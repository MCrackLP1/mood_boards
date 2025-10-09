"use client";

import { ImageItem } from "@/types";
import Image from "next/image";
import { Palette } from 'color-thief-react';
import { useBoards } from "@/lib/BoardContext";

interface ImageCardProps {
    image: ImageItem;
}

export default function ImageCard({ image }: ImageCardProps) {
    const { activeColor, setActiveColor } = useBoards();
    
    return (
        <Palette src={image.url} crossOrigin="anonymous" format="hex" colorCount={5}>
            {({ data, loading }) => {
                const containsActiveColor = data?.includes(activeColor || '') || false;
                const isFiltered = activeColor && !containsActiveColor;

                const swatches = (colors: string[] | undefined) => {
                    if (!colors) return null;
                    return (
                        <div className="flex h-10 bg-gray-50">
                            {colors.map((color, index) => (
                                <button
                                    key={index}
                                    className="flex-1 relative group/swatch transition-all duration-200 hover:flex-[1.5]"
                                    style={{ backgroundColor: color }}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        setActiveColor(activeColor === color ? null : color);
                                    }}
                                    aria-label={`Filter by color ${color}`}
                                    title={color}
                                >
                                    {activeColor === color && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                                            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    );
                };

                if (loading) return (
                    <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300">
                        <Image src={image.url} alt={image.filename} width={500} height={500} className="w-full h-auto" />
                        <div className="h-8 w-full bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse" />
                    </div>
                );

                return (
                    <div className={`group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 ${isFiltered ? 'opacity-30 scale-95' : 'opacity-100 scale-100'}`}>
                        <div className="relative overflow-hidden">
                            <Image
                                src={image.url}
                                alt={image.filename}
                                width={500}
                                height={500}
                                className="w-full h-auto transform group-hover:scale-105 transition-transform duration-500"
                            />
                        </div>
                        {swatches(data)}
                    </div>
                );
            }}
        </Palette>
    );
}
