import { useCallback, useEffect, useState } from "react";
import Topbar from "../../components/layout/topbar";
import { MatchCardData } from "../../model/data";
import Table from "../../components/shared/table";
import { getFile } from "../../composables/storage";
import { addData, deleteData, editData, getData } from "../../composables/firestore";

export default function ManagementPage() {
    const columns = [
        {
            header: 'รูปภาพ',
            column: (data: MatchCardData) => <img src={data.image} alt="imagez" className="w-24 h-24" />
        },
        {
            header: 'รูปภาพคำศัพท์',
            column: (data: MatchCardData) => <img src={data.wordImage} alt="word-imagez" className="w-24 h-24" />
        },
        {
            header: 'คำศัพท์',
            column: (data: MatchCardData) => data.word
        },
        {
            header: 'ความหมาย',
            column: (data: MatchCardData) => data.meaning
        },
        {
            header: '',
            column: (data: MatchCardData) => (
                <div className="flex items-center gap-2">
                    {/* <button onClick={() => addDataManagement(data)} className="w-full text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-2 py-1 text-center">Approve</button> */}
                    <button onClick={() => updateDataManagement(data)} className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-2 py-1 text-center">Edit</button>
                    <button onClick={() => deleteDataManagement(data)} className="w-full text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-2 py-1 text-center">Delete</button>
                </div>
            )
        },
    ]
    const [data, setData] = useState<MatchCardData[]>([]);

    const fetchData = useCallback(async () => {
        const requests = await getData()
        const data: MatchCardData[] = [];
        for (const request of requests) {
            const requestData = request.data();
            requestData.image = await getFile(requestData.image);
            requestData.wordImage = await getFile(requestData.wordImage);
            requestData._id = request.id;
            data.push({...requestData})
        }
        setData(data)
    }, [setData]);

    const addDataManagement = useCallback(async (data: MatchCardData) => {
        await addData(data);
        await fetchData();
    }, [fetchData])

    const updateDataManagement = useCallback(async (data: MatchCardData) => {
        await editData(data._id, data);
        await fetchData();
    }, [fetchData])

    const deleteDataManagement = useCallback(async (data: MatchCardData) => {
        await deleteData(data._id);
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