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
                        <div className="flex">
                            {colors.map((color, index) => (
                                <button
                                    key={index}
                                    className="h-6 w-full"
                                    style={{ backgroundColor: color }}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        setActiveColor(activeColor === color ? null : color);
                                    }}
                                    aria-label={`Filter by color ${color}`}
                                />
                            ))}
                        </div>
                    );
                };

                if (loading) return (
                    <div className="mb-4 bg-gray-50 rounded-lg overflow-hidden shadow-sm">
                        <Image src={image.url} alt={image.filename} width={500} height={500} className="w-full h-auto" />
                        <div className="h-6 w-full bg-gray-200 animate-pulse" />
                    </div>
                );

                return (
                    <div className={`mb-4 bg-gray-50 rounded-lg overflow-hidden shadow-sm transition-opacity ${isFiltered ? 'opacity-20' : 'opacity-100'}`}>
                        <Image
                            src={image.url}
                            alt={image.filename}
                            width={500}
                            height={500}
                            className="w-full h-auto"
                        />
                        {swatches(data)}
                    </div>
                );
            }}
        </Palette>
    );
}
