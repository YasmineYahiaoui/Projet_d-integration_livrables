import React from 'react';

export default function Table({
                                  columns,
                                  data,
                                  keyField = 'id',
                                  onRowClick,
                                  className = '',
                                  emptyMessage = 'Aucune donnée disponible',
                                  loading = false,
                                  loadingRows = 3,
                                  hover = true,
                                  striped = false,
                                  bordered = true,
                                  size = 'md', // 'sm', 'md', 'lg'
                                  ...props
                              }) {
    // Définir les styles en fonction des propriétés
    const tableClasses = `min-w-full divide-y divide-gray-200 ${className}`;

    const rowClasses = `
    ${hover ? 'hover:bg-gray-50' : ''}
    ${striped ? 'even:bg-gray-50' : ''}
    ${onRowClick ? 'cursor-pointer' : ''}
    ${size === 'sm' ? 'py-2' : size === 'lg' ? 'py-4' : 'py-3'}
  `;

    const cellClasses = `
    ${bordered ? 'border-b border-gray-200' : ''}
    ${size === 'sm' ? 'px-3 py-2' : size === 'lg' ? 'px-8 py-4' : 'px-6 py-3'}
  `;

    // Afficher un état de chargement
    if (loading) {
        return (
            <div className="overflow-x-auto">
                <table className={tableClasses} {...props}>
                    <thead className="bg-gray-50">
                    <tr>
                        {columns.map((column) => (
                            <th
                                key={column.key || column.name}
                                className={`${cellClasses} text-left text-xs font-medium text-gray-500 uppercase tracking-wider`}
                                style={column.width ? { width: column.width } : {}}
                            >
                                {column.name}
                            </th>
                        ))}
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {[...Array(loadingRows)].map((_, index) => (
                        <tr key={index}>
                            {columns.map((column, colIndex) => (
                                <td key={colIndex} className={cellClasses}>
                                    <div className="animate-pulse h-4 bg-gray-200 rounded w-3/4"></div>
                                </td>
                            ))}
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        );
    }

    // Afficher un message si pas de données
    if (!data || data.length === 0) {
        return (
            <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
                <p className="text-gray-500">{emptyMessage}</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className={tableClasses} {...props}>
                <thead className="bg-gray-50">
                <tr>
                    {columns.map((column) => (
                        <th
                            key={column.key || column.name}
                            className={`${cellClasses} text-left text-xs font-medium text-gray-500 uppercase tracking-wider`}
                            style={column.width ? { width: column.width } : {}}
                        >
                            {column.name}
                        </th>
                    ))}
                </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                {data.map((row) => (
                    <tr
                        key={row[keyField] || row.id || JSON.stringify(row)}
                        className={rowClasses}
                        onClick={onRowClick ? () => onRowClick(row) : undefined}
                    >
                        {columns.map((column) => (
                            <td key={column.key || column.name} className={cellClasses}>
                                {column.render
                                    ? column.render(row[column.key], row)
                                    : row[column.key || column.name]}
                            </td>
                        ))}
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}