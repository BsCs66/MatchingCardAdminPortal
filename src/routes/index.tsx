import { useCallback, useEffect, useState } from "react";
import Topbar from "../components/layout/topbar";
import Table from "../components/shared/table";
import { Data, Level } from "../model/data";
import { getRequest, importRequestData, updateRequestStatus } from "../composables/firestore";
import { getFile } from "../composables/storage";

export default function HomePage() {
    const columns = [
        {
            header: 'รูปภาพ',
            column: (data: Data) => <img src={data.image} alt="imagez" className="w-24 h-24" />
        },
        {
            header: 'รูปภาพคำศัพท์',
            column: (data: Data) => <img src={data.wordImage} alt="word-imagez" className="w-24 h-24" />
        },
        {
            header: 'คำศัพท์',
            column: (data: Data) => data.word
        },
        {
            header: 'ความหมาย',
            column: (data: Data) => data.meaning
        },
        {
            header: 'สถานะ',
            column: (data: Data) => data.status || 'pending'
        },
        {
            header: '',
            column: (data: Data) => !data.status
                ? (
                    <div className="flex items-center gap-2">
                        <button onClick={() => updateData(data._id, 'approved')} className="w-full text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-2 py-1 text-center">Approve</button>
                        <button onClick={() => updateData(data._id, 'rejected')} className="w-full text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-2 py-1 text-center">Reject</button>
                    </div>
                )
                : (data.status === 'approved' && (
                    <div className="flex gap-2">
                        <button onClick={() => importData(data._id, Level.Easy)} className="w-full text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-2 py-1 text-center">ง่าย</button>
                        <button onClick={() => importData(data._id, Level.Medium)} className="w-full text-black bg-yellow-200 hover:bg-yellow-300 focus:ring-4 focus:outline-none focus:ring-yellow-300 font-medium rounded-lg text-sm px-2 py-1 text-center">ปานกลาง</button>
                        <button onClick={() => importData(data._id, Level.Hard)} className="w-full text-white bg-pink-700 hover:bg-pink-800 focus:ring-4 focus:outline-none focus:ring-pink-300 font-medium rounded-lg text-sm px-2 py-1 text-center">ยาก</button>
                    </div>
                ))
        },
    ]
    const [data, setData] = useState<Data[]>([]);

    const fetchData = useCallback(async () => {
        const requests = await getRequest()
        const data: Data[] = [];
        for (const request of requests) {
            const requestData = request.data();
            requestData.image = await getFile(requestData.image);
            requestData.wordImage = await getFile(requestData.wordImage);
            requestData._id = request.id;
            data.push({...requestData})
        }
        setData(data)
    }, [setData]);

    const updateData = useCallback(async (id: string, status: 'approved' | 'rejected') => {
        await updateRequestStatus(id, status)
        await fetchData();
    }, [fetchData])

    const importData = useCallback(async (id: string, level: Level) => {
        await importRequestData(id, level)
        await fetchData();
    }, [fetchData])

    useEffect(() => {
        fetchData();
    }, [fetchData])

    return (
        <>
            <Topbar />
            <div className="p-4">
                <Table
                    columns={columns}
                    data={data}
                />
            </div>
        </>
    )
}