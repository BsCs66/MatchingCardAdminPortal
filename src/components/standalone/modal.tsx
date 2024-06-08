import { Button, Label, Modal, Select, TextInput } from "flowbite-react";
import { Level, MatchCardData } from "../../model/data";
import { useEffect, useState } from "react";
import { Dropzone } from "../shared/dropzone";

export default function DataManagementModal(props: {mode: 'add' | 'edit', data: MatchCardData, open: boolean, close: () => void, submit: (data: MatchCardData, imageFile?: File, wordImageFile?: File) => void}) {
    const [imageFile, setImageFile] = useState<File>();
    const [wordImageFile, setWordImageFile] = useState<File>();
    const [dataManagement, setDataManagement] = useState<MatchCardData>({...props.data});
    useEffect(() => {
        setDataManagement({...props.data})
    }, [props])
    return (
        <Modal show={props.open} onClose={() => props.close()}>
            <Modal.Header>{ props.mode === 'add' ? 'เพิ่มคำศัพท์' : 'แก้ไขคำศัพท์' }</Modal.Header>
            <Modal.Body>
                <div className="space-y-6">
                    <div className="flex justify-between gap-8">
                        <div className="space-y-2">
                            <div>
                                <Label htmlFor="image" value="รูปภาพ" />
                                {dataManagement.image ? (
                                    <div className="relative">
                                        <img alt="main-word" src={dataManagement.image} className="min-w-32 min-h-32 max-w-32 max-h-32 object-cover" />
                                        <div className="hover:scale-110 cursor-pointer rounded-full p-1 bg-red-500 text-white absolute -top-2 -right-2" onClick={() => {setDataManagement({...dataManagement, image: ''}); setImageFile(undefined)}}>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                            </svg>
                                        </div>
                                    </div>
                                ) : <Dropzone onUpload={(file) => {setImageFile(file); setDataManagement({...dataManagement, image: URL.createObjectURL(file)})}} />}
                            </div>

                            <div>
                                <Label htmlFor="wordImage" value="รูปภาพคำศัพท์" />
                                {dataManagement.wordImage ? (
                                    <div className="relative">
                                        <img alt="sub-word" src={dataManagement.wordImage} className="min-w-32 min-h-32 max-w-32 max-h-32 object-cover" />
                                        <div className="hover:scale-110 cursor-pointer rounded-full p-1 bg-red-500 text-white absolute -top-2 -right-2" onClick={() => {setDataManagement({...dataManagement, wordImage: ''}); setWordImageFile(undefined)}}>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                            </svg>
                                        </div>
                                    </div>
                                ) : <Dropzone onUpload={(file) => {setWordImageFile(file); setDataManagement({...dataManagement, wordImage: URL.createObjectURL(file)})}} />}
                            </div>
                        </div>

                        <div className="space-y-2 w-full">
                            <div>
                                <Label htmlFor="word" value="คำศัพท์" />
                                <TextInput
                                    placeholder="Word"
                                    value={dataManagement.word}
                                    onChange={e => setDataManagement({...dataManagement, word: e.target.value || ''})}
                                />
                            </div>

                            <div>
                                <Label htmlFor="meaning" value="ความหมาย" />
                                <TextInput
                                    placeholder="Meaning"
                                    value={dataManagement.meaning}
                                    onChange={e => setDataManagement({...dataManagement, meaning: e.target.value || ''})}
                                />
                            </div>

                            <div>
                                <Label htmlFor="level" value="ระดับ" />
                                <Select value={dataManagement.level} onChange={e => setDataManagement({...dataManagement, level: e.target.value as Level})}>
                                    <option value={Level.Easy}>ง่าย</option>
                                    <option value={Level.Medium}>ปานกลาง</option>
                                    <option value={Level.Hard}>ยาก</option>
                                </Select>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <div className="w-fit space-x-4 ml-auto flex items-center">
                    <Button color="red" onClick={() => props.close()}>
                        ยกเลิก
                    </Button>
                    <Button
                        color="green"
                        onClick={() => props.submit(dataManagement!, imageFile, wordImageFile)}
                        disabled={dataManagement.word.length === 0 || dataManagement.meaning.length === 0 || dataManagement.image.length === 0 || dataManagement.wordImage.length === 0}
                    >
                        ยืนยัน
                    </Button>
                </div>
            </Modal.Footer>
        </Modal>
    )
}