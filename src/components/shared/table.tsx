import { Data } from "../../model/data";

export type Props = {
    columns: string[];
    data: Data[];
    // action: (id: string) => void,
}

export default function Table({ columns, data }: Props) {
    return (
        <div className="relative overflow-x-auto">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        {columns.map((column, index) => (
                            <th key={index} scope="col" className="px-6 py-3">
                                {column}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((data, index) => (
                        <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                            <img src={data.image} className="w-6 h-6" />
                            <td className="px-6 py-4">
                                {data.word}
                            </td>
                            <td className="px-6 py-4">
                                {data.meaning}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}