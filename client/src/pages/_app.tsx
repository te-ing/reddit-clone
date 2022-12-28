import '../styles/globals.css';
import type { AppProps } from 'next/app';
import axios from 'axios';
import { AuthProvider } from '@/context/auth';
import { useRouter } from 'next/router';
import NavBar from '@/components/NavBar';

function MyApp({ Component, pageProps }: AppProps) {
  axios.defaults.baseURL = process.env.NEXT_PUBLIC_SERVER_BASE_URL + '/api';
  axios.defaults.withCredentials = true;

  const { pathname } = useRouter();
  const authRoutes = ['/register', '/login'];
  const authRoute = authRoutes.includes(pathname);

  return (
    <AuthProvider>
      {!authRoute && <NavBar />}
      <div className={authRoute ? '' : 'pt-12'}></div>
      <Component {...pageProps} />
    </AuthProvider>
  );
}

export default MyApp;
