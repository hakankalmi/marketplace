import { initializeApp, getApps } from 'firebase/app';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyAG_P0wMWQU3FAeH1tufMZzSPTqfGnjP6Q',
  authDomain: 'crmapp35.firebaseapp.com',
  projectId: 'crmapp35',
  storageBucket: 'crmapp35.appspot.com',
  messagingSenderId: '588392579348',
  appId: '1:588392579348:web:49846b50498fa830e84201',
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const storage = getStorage(app);
