import Head from 'next/head';
import { getLayout } from '../components/layouts/DefaultLayout';
import HeadingBar from '../components/core/HeadingBar';
import dynamic from 'next/dynamic';

const MainContent = dynamic(() => import('../components/core/MainContent'), { ssr: false });

const Home = (props) => {
  return (
    <div className="overflow-auto">
      <Head>
        <title>SuperREPL ⚡</title>
      </Head>

      <HeadingBar heading={props.heading} />

      <MainContent />
    </div>
  );
};

export async function getStaticProps() {
  return {
    props: {
      heading: 'SuperREPL',
    },
  };
}

Home.getLayout = getLayout;

export default Home;

