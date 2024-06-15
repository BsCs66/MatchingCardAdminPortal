import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, initializeFirestore, query, updateDoc, QueryDocumentSnapshot, DocumentData, orderBy, QueryConstraint, where } from 'firebase/firestore';
import app from './firebase';
import { Data, Level, MatchCardData } from '../model/data';
import { converter } from '../model/converter';
import { deleteFile } from './storage';

const firestore = initializeFirestore(app, { ignoreUndefinedProperties: true });

const requestCollection = 'RequestData'
const dataCollection = 'AppData'

export async function getRequest() {
    const snapshot = await getDocs(query(collection(firestore, requestCollection).withConverter(converter<Data>())));
    return snapshot.docs
}

export async function updateRequestStatus(id: string, status: 'approved' | 'rejected') {
    if (status === 'rejected') {
        await deleteRequestFiles(id);
        await deleteDoc(doc(firestore, requestCollection, id));
    } else {
        await updateDoc(doc(firestore, requestCollection, id), {status})
    }
}

export async function importRequestData(id: string, level: Level) {
    const snapshot = await getDoc(doc(firestore, requestCollection, id))
    const data = snapshot.data();
    if (!data) {
        throw Error('data not found')
    }
    await addDoc(collection(firestore, dataCollection), {
        id: data.id,
        image: data.image,
        wordImage: data.wordImage,
        word: data.word,
        meaning: data.meaning,
        level,
    })
    await deleteDoc(doc(firestore, requestCollection, id));
}

async function deleteRequestFiles(id: string) {
    const snapshot = await getDoc(doc(firestore, requestCollection, id).withConverter(converter<Data>()));
    const data = snapshot.data();
    if (!data ) {
        throw Error('data not found');
    }
    await deleteFile(data.image);
    await deleteFile(data.wordImage);
}

export async function getAllData(page: number, filter?: Level, limitPerPage = 10) {
    const queryConstraint: QueryConstraint[] = [];

    if (filter) {
        queryConstraint.push(where("level", '==', filter));
    }

    queryConstraint.push(orderBy("word"));

    const snapshot = await getDocs(query(
        collection(firestore, dataCollection).withConverter(converter<MatchCardData>()),
        ...queryConstraint,
    ));
    const docs: QueryDocumentSnapshot<MatchCardData, DocumentData>[] = [];
    for (let i=0; i<snapshot.size; i++) {
        if (i >= (page-1)*limitPerPage && docs.length < limitPerPage) {
            docs.push(snapshot.docs[i]);
        }
    }
    return {
        data: docs,
        total: snapshot.size,
    }
}

export async function getData(id: string) {
    return await getDoc(doc(firestore, dataCollection, id).withConverter(converter<MatchCardData>()));
}

export async function addData(data: MatchCardData) {
    await addDoc(collection(firestore, dataCollection), data);
}

export async function editData(id: string, data: MatchCardData) {
    await updateDoc(doc(firestore, dataCollection, id), data)
}

export async function deleteData(id: string) {
    const snapshot = await getDoc(doc(firestore, dataCollection, id).withConverter(converter<MatchCardData>()));
    const data = snapshot.data();
    if (!data ) {
        throw Error('data not found');
    }
    await deleteFile(data.image);
    await deleteFile(data.wordImage);
    await deleteDoc(doc(firestore, dataCollection, id));
}
