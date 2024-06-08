import { NextOrObserver, User, getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import app from './firebase';

const auth = getAuth(app);

export async function observeAuth(onObserve: NextOrObserver<User>) {
    return onAuthStateChanged(auth, onObserve);
}

export async function loginFirebase(email: string, password: string) {
    await auth.authStateReady();
    const credential = await signInWithEmailAndPassword(auth, email, password);
    return credential?.user.uid;
}

export async function logoutFirebase() {
    await auth.authStateReady();
    await signOut(auth);
}