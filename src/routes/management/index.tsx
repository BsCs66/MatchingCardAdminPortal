import { useCallback, useEffect, useState } from "react";
import Topbar from "../../components/layout/topbar";
import { Level, MatchCardData } from "../../model/data";
import Table from "../../components/shared/table";
import { deleteFile, getFile, uploadFile } from "../../composables/storage";
import { addData, deleteData, editData, getData, getAllData } from "../../composables/firestore";
import DataManagementModal from "../../components/standalone/modal";
import { Select } from "flowbite-react";

const limitPerPage = 10;

export default function ManagementPage() {
    const [openModal, setOpenModal] = useState<'add' | 'edit' | 'closed'>('closed');
    const [dataManagement, setDataManagement] = useState<MatchCardData>(initialDataManagement());
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [filter, setFilter] = useState<Level | ''>('');

    const columns = [
        {
            header: 'รูปภาพ',
            column: (data: MatchCardData) => data.image.startsWith('images') ? <div className="animate-pulse w-24 h-24 bg-gray-700"></div> : <img src={data.image} alt="imagez" className="w-24 h-24" />
        },
        {
            header: 'รูปภาพคำศัพท์',
            column: (data: MatchCardData) => data.wordImage.startsWith('images') ? <div className="animate-pulse w-24 h-24 bg-gray-700"></div> : <img src={data.wordImage} alt="word-imagez" className="w-24 h-24" />
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
        const result = await getAllData(currentPage, filter || undefined, limitPerPage);
        setTotalPages(Math.ceil(result.total/limitPerPage))
        const data: MatchCardData[] = [];
        for (const request of result.data) {
            const requestData = request.data();
            requestData._id = request.id;
            data.push({...requestData})
        }
        setData([...data])
        data.length = 0;
        for (const request of result.data) {
            const requestData = request.data();
            requestData.image = await getFile(requestData.image);
            requestData.wordImage = await getFile(requestData.wordImage);
            requestData._id = request.id;
            data.push({...requestData})
        }
        setData([...data])
    }, [setData, currentPage, filter]);

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
    }, [fetchData, currentPage, filter])

    return (
        <>
            <Topbar />
            <div className="p-4">
                <div className="flex items-center justify-between gap-4 mb-2">
                    <Select className="min-w-48" value={filter} onChange={e => {setCurrentPage(1); setFilter(e.target.value as Level || '');}}>
                        <option value="">ทุกระดับ</option>
                        <option value={Level.Easy}>ง่าย</option>
                        <option value={Level.Medium}>ปานกลาง</option>
                        <option value={Level.Hard}>ยาก</option>
                    </Select>
                    <button onClick={() => {setDataManagement(initialDataManagement()); setOpenModal('add')}} className="w-fit text-white h-[42px] bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-2 py-1 text-center">เพิ่มคำศัพท์</button>
                </div>
                <Table
                    columns={columns}
                    data={data}
                    pagination={{
                        totalPages,
                        currentPage,
                        onPageChange: setCurrentPage,
                    }}
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