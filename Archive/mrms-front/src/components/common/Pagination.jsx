import React from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

export default function Pagination({
                                       currentPage,
                                       totalPages,
                                       onPageChange,
                                       siblingCount = 1,
                                       boundaryCount = 1,
                                       showFirstButton = true,
                                       showLastButton = true,
                                       size = 'md', // 'sm', 'md', 'lg'
                                       className = '',
                                       shape = 'rounded', // 'rounded', 'circle'
                                       showPageInfo = true,
                                       pageInfoText,
                                       totalItems,
                                       itemsPerPage,
                                       ...props
                                   }) {
    // Si une seule page, ne pas afficher la pagination
    if (totalPages <= 1) return null;

    // Générer la liste des pages à afficher
    const range = (start, end) => {
        const length = end - start + 1;
        return Array.from({ length }, (_, i) => start + i);
    };

    const startPages = range(1, Math.min(boundaryCount, totalPages));
    const endPages = range(Math.max(totalPages - boundaryCount + 1, boundaryCount + 1), totalPages);

    const siblingsStart = Math.max(
        Math.min(
            currentPage - siblingCount,
            totalPages - boundaryCount - siblingCount * 2 - 1
        ),
        boundaryCount + 2
    );

    const siblingsEnd = Math.min(
        Math.max(
            currentPage + siblingCount,
            boundaryCount + siblingCount * 2 + 2
        ),
        endPages.length > 0 ? endPages[0] - 2 : totalPages - 1
    );

    const itemList = [
        ...startPages,
        ...(siblingsStart > boundaryCount + 2
            ? ['ellipsis']
            : boundaryCount + 1 < totalPages - boundaryCount
                ? [boundaryCount + 1]
                : []),
        ...range(siblingsStart, siblingsEnd),
        ...(siblingsEnd < totalPages - boundaryCount - 1
            ? ['ellipsis']
            : totalPages - boundaryCount > boundaryCount
                ? [totalPages - boundaryCount]
                : []),
        ...endPages
    ];

    // Styles en fonction de la taille
    const buttonSizeClasses = {
        sm: 'h-8 w-8 text-sm',
        md: 'h-10 w-10',
        lg: 'h-12 w-12 text-lg'
    };

    const buttonShapeClasses = {
        rounded: 'rounded-md',
        circle: 'rounded-full'
    };

    const sizeClass = buttonSizeClasses[size] || buttonSizeClasses.md;
    const shapeClass = buttonShapeClasses[shape] || buttonShapeClasses.rounded;

    // Générer le texte d'information sur les pages
    const getPageInfoText = () => {
        if (pageInfoText) return pageInfoText;

        if (totalItems !== undefined && itemsPerPage !== undefined) {
            const start = (currentPage - 1) * itemsPerPage + 1;
            const end = Math.min(currentPage * itemsPerPage, totalItems);
            return `Affichage de ${start} à ${end} sur ${totalItems} éléments`;
        }

        return `Page ${currentPage} sur ${totalPages}`;
    };

    return (
        <div
            className={`flex flex-col sm:flex-row sm:items-center sm:justify-between ${className}`}
            {...props}
        >
            {showPageInfo && (
                <div className="text-sm text-gray-700 mb-4 sm:mb-0">
                    {getPageInfoText()}
                </div>
            )}

            <nav className="flex justify-center sm:justify-end space-x-1">
                {/* Bouton Première page */}
                {showFirstButton && (
                    <button
                        onClick={() => onPageChange(1)}
                        disabled={currentPage === 1}
                        className={`${sizeClass} ${shapeClass} flex items-center justify-center ${
                            currentPage === 1
                                ? 'text-gray-400 cursor-not-allowed'
                                : 'text-gray-700 hover:bg-gray-100'
                        }`}
                        aria-label="Première page"
                    >
                        <span className="sr-only">Première page</span>
                        <svg
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
                            />
                        </svg>
                    </button>
                )}

                {/* Bouton Page précédente */}
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`${sizeClass} ${shapeClass} flex items-center justify-center ${
                        currentPage === 1
                            ? 'text-gray-400 cursor-not-allowed'
                            : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    aria-label="Page précédente"
                >
                    <span className="sr-only">Page précédente</span>
                    <ChevronLeftIcon className="h-5 w-5" />
                </button>

                {/* Pages */}
                {itemList.map((item, index) => {
                    if (item === 'ellipsis') {
                        return (
                            <span
                                key={`ellipsis-${index}`}
                                className={`${sizeClass} ${shapeClass} flex items-center justify-center text-gray-400`}
                            >
                …
              </span>
                        );
                    }

                    return (
                        <button
                            key={item}
                            onClick={() => onPageChange(item)}
                            aria-current={currentPage === item ? 'page' : undefined}
                            className={`${sizeClass} ${shapeClass} flex items-center justify-center ${
                                currentPage === item
                                    ? 'bg-[#5CB1B1] text-white'
                                    : 'text-gray-700 hover:bg-gray-100'
                            }`}
                        >
                            {item}
                        </button>
                    );
                })}

                {/* Bouton Page suivante */}
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`${sizeClass} ${shapeClass} flex items-center justify-center ${
                        currentPage === totalPages
                            ? 'text-gray-400 cursor-not-allowed'
                            : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    aria-label="Page suivante"
                >
                    <span className="sr-only">Page suivante</span>
                    <ChevronRightIcon className="h-5 w-5" />
                </button>

                {/* Bouton Dernière page */}
                {showLastButton && (
                    <button
                        onClick={() => onPageChange(totalPages)}
                        disabled={currentPage === totalPages}
                        className={`${sizeClass} ${shapeClass} flex items-center justify-center ${
                            currentPage === totalPages
                                ? 'text-gray-400 cursor-not-allowed'
                                : 'text-gray-700 hover:bg-gray-100'
                        }`}
                        aria-label="Dernière page"
                    >
                        <span className="sr-only">Dernière page</span>
                        <svg
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13 5l7 7-7 7M5 5l7 7-7 7"
                            />
                        </svg>
                    </button>
                )}
            </nav>
        </div>
    );
}