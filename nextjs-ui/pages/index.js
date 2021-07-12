import Head from 'next/head';
import { getLayout } from '../components/layouts/DefaultLayout';
import HeadingBar from '../components/core/HeadingBar';
import ButtonsBar from '../components/ui/ButtonsBar';
// import Repl from '../components/'
import dynamic from 'next/dynamic';

const Repl = dynamic(() => import('../components/core/Repl'), { ssr: false });

const Home = (props) => {
  return (
    <div className="overflow-scroll">
      <Head>
        <title>SuperREPL ⚡</title>
      </Head>

      <HeadingBar heading={props.heading} />
      <div className="app-content py-4 px-12">
        <Repl />

        <ButtonsBar />

        <hr className="mt-12 mb-3" />
      </div>
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

