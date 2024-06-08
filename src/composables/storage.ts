import { getStorage, uploadBytes, ref, getDownloadURL, deleteObject } from 'firebase/storage';
import app from './firebase';

const storage = getStorage(app);

export async function uploadFile(url: string, file: File) {
    return await uploadBytes(ref(storage, url), file);
}

export async function getFile(url: string) {
    return await getDownloadURL(ref(storage, url));
}

export async function deleteFile(url: string) {
    return await deleteObject(ref(storage, url));
}
