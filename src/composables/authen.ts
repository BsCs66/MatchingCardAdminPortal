import { NextOrObserver, User, initializeAuth, onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';
import app from './firebase';

const auth = initializeAuth(app);

export async function observeAuth(onObserve: NextOrObserver<User>) {
    return onAuthStateChanged(auth, onObserve);
}

export async function loginFirebase(email: string, password: string) {
    await auth.authStateReady();
    const credential = await signInWithEmailAndPassword(auth, email, password);
    return credential?.user.uid;
}