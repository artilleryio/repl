// import Link from 'next/link';
// import Sidebar from '../core/Sidebar';

const DefaultLayout = ({ children, ...pageProps }) => (
  <div className="flex h-screen overflow-auto">
    <main className="app-main">{children}</main>
  </div>
);

export const getLayout = (page) => <DefaultLayout>{page}</DefaultLayout>;

export default DefaultLayout;
