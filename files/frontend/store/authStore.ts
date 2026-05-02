import { create } from 'zustand';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

interface UserData {
  uid: string;
  email: string;
  name: string;
  phone?: string;
  address?: string;
  isAdmin?: boolean;
}

interface AuthStore {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
  signup: (email: string, password: string, name: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  initialize: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  userData: null,
  loading: true,

  signup: async (email, password, name) => {
    const { user } = await createUserWithEmailAndPassword(auth, email, password);
    const userData: UserData = {
      uid: user.uid,
      email,
      name,
    };
    await setDoc(doc(db, 'users', user.uid), userData);
    set({ user, userData });
  },

  login: async (email, password) => {
    const { user } = await signInWithEmailAndPassword(auth, email, password);
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    const userData = userDoc.data() as UserData;
    set({ user, userData });
  },

  logout: async () => {
    await signOut(auth);
    set({ user: null, userData: null });
  },

  initialize: () => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        set({
          user,
          userData: userDoc.data() as UserData,
          loading: false,
        });
      } else {
        set({ user: null, userData: null, loading: false });
      }
    });
  },
}));