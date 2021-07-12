import Head from 'next/head';
import dynamic from 'next/dynamic';
import { getLayout } from '../components/layouts/DefaultLayout';
import HeadingBar from '../components/core/HeadingBar';
import ButtonsBar from '../components/ui/ButtonsBar';

const Editor = dynamic(() => import('../components/core/Editor'), {
  ssr: false,
});

const Home = (props) => {
  return (
    <div className="overflow-scroll">
      <Head>
        <title>SuperREPL ⚡</title>
      </Head>

      <HeadingBar heading={props.heading} />
      <div className="app-content py-4 px-12">
        <div className="grid grid-cols-2 gap-4">
          <div className="border-solid border-4 border-light-blue-500">
            <Editor></Editor>
          </div>

          <div className="border-solid border-4 border-light-blue-500">
            <div id="results">Results</div>
          </div>
        </div>

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
