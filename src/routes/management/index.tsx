import { useCallback, useEffect, useState } from "react";
import Topbar from "../../components/layout/topbar";
import { Level, MatchCardData } from "../../model/data";
import Table from "../../components/shared/table";
import { deleteFile, getFile, uploadFile } from "../../composables/storage";
import { addData, deleteData, editData, getData, getAllData } from "../../composables/firestore";
import DataManagementModal from "../../components/standalone/modal";

export default function ManagementPage() {
    const [openModal, setOpenModal] = useState<'add' | 'edit' | 'closed'>('closed');
    const [dataManagement, setDataManagement] = useState<MatchCardData>(initialDataManagement());

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
            header: 'ระดับ',
            column: (data: MatchCardData) => {
                switch(data.level) {
                    case Level.Easy:
                        return 'ง่าย'
                    case Level.Medium:
                        return 'ปานกลาง'
                    case Level.Hard:
                        return 'ยาก'
                    default:
                        return 'ไม่สามารถระบุได้'
                }
            }
        },
        {
            header: '',
            column: (data: MatchCardData) => (
                <div className="flex items-center gap-2">
                    <button onClick={() => {setDataManagement(data); setOpenModal('edit')}} className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-2 py-1 text-center">แก้ไข</button>
                    <button onClick={() => deleteDataManagement(data)} className="w-full text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-2 py-1 text-center">ลบ</button>
                </div>
            )
        },
    ]
    const [data, setData] = useState<MatchCardData[]>([]);

    const fetchData = useCallback(async () => {
        const requests = await getAllData()
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

    function initialDataManagement(): MatchCardData {
        return {
            image: '',
            level: Level.Easy,
            meaning: '',
            word: '',
            wordImage: '',
        }
    }

    const addDataManagement = useCallback(async (data: MatchCardData, imageFile?: File, wordImageFile?: File) => {
        if (!imageFile || !wordImageFile) {
            return;
        }
        data.id = new Date().getTime().toString();
        data.image = 'images/'+data.id+imageFile.name.substring(imageFile.name.lastIndexOf('.'));
        data.wordImage = 'images/'+data.id+"_word"+wordImageFile.name.substring(wordImageFile.name.lastIndexOf('.'));
        await uploadFile(data.image, imageFile)
        await uploadFile(data.wordImage, wordImageFile)
        await addData(data);
        setDataManagement(initialDataManagement());
        setOpenModal('closed');
        await fetchData();
    }, [fetchData, setDataManagement, setOpenModal])

    const updateDataManagement = useCallback(async (data: MatchCardData, imageFile?: File, wordImageFile?: File) => {
        const originalData = await getData(data._id!)
        const tmpData = originalData.data();
        data.image = tmpData?.image || '';
        data.wordImage = tmpData?.wordImage || '';
        if (imageFile) {
            await deleteFile(data.image);
            data.image = 'images/'+data.id+imageFile.name.substring(imageFile.name.lastIndexOf('.'));
            await uploadFile(data.image, imageFile)
        }
        if (wordImageFile) {
            await deleteFile(data.wordImage);
            data.wordImage = 'images/'+data.id+"_word"+wordImageFile.name.substring(wordImageFile.name.lastIndexOf('.'));
            await uploadFile(data.wordImage, wordImageFile)
        }
        await editData(data._id!, data);
        setDataManagement(initialDataManagement());
        setOpenModal('closed');
        await fetchData();
    }, [fetchData, setDataManagement, setOpenModal])

    const deleteDataManagement = useCallback(async (data: MatchCardData) => {
        try {
            await deleteData(data._id!);
        } catch (error) {
            console.error(error)
        }
        await fetchData();
    }, [fetchData])

    useEffect(() => {
        fetchData();
    }, [fetchData])

    return (
        <>
            <Topbar />
            <div className="p-4">
                <button onClick={() => setOpenModal('add')} className="w-full text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-2 py-1 text-center">Add</button>
                <Table
                    columns={columns}
                    data={data}
                />
            </div>

            <DataManagementModal
                open={openModal === 'add'}
                close={() => setOpenModal('closed')}
                data={dataManagement}
                mode="add"
                submit={addDataManagement}
            />

            <DataManagementModal
                open={openModal === 'edit'}
                close={() => setOpenModal('closed')}
                data={dataManagement}
                mode="edit"
                submit={updateDataManagement}
            />
        </>
    )
}