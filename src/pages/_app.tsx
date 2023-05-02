import { ToastContainer } from 'react-toastify';
import type { AppProps } from 'next/app';

import 'react-toastify/dist/ReactToastify.css';

import '@/styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <main>
      <Component {...pageProps} />
      <ToastContainer />
    </main>
  );
}
