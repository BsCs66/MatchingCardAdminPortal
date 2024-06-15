import { Pagination } from "flowbite-react";

type ColumnProps<T> = {
    header: React.ReactNode;
    column: (data: T, index: number) => React.ReactNode;
}

export type Props<T> = {
    columns: ColumnProps<T>[];
    data: T[];
    pagination?: {
        totalPages: number;
        currentPage: number;
        onPageChange: (page: number) => void;
    }
}

export default function Table<T>({ columns, data, pagination }: Props<T>) {
    return (
        <div className="space-y-2">
            <div className="relative overflow-x-auto">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            {columns.map((column, index) => (
                                <th key={index} scope="col" className="px-6 py-3">
                                    {column.header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((data, index) => (
                            <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                {columns.map((column, index) => (
                                    <td className="px-6 py-4" key={index}>
                                        {column.column(data, index)}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {pagination && <Pagination {...pagination} />}
        </div>
    )
}