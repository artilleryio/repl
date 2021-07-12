import Head from 'next/head';
import dynamic from 'next/dynamic'
import { getLayout } from '../components/layouts/DefaultLayout';
import HeadingBar from '../components/core/HeadingBar';

const Editor = dynamic(
  () => import('../components/core/Editor'),
  { ssr: false }
)

const Home = (props) => {
  return (
    <div>
      <Head>
        <title>SuperREPL ⚡</title>
      </Head>

      <HeadingBar heading={props.heading} />
      <div className="app-content py-4 px-12 overflow-scroll">
        <div className="grid grid-cols-2 gap-4">
          <div className="border-solid border-4 border-light-blue-500">
            <Editor></Editor>
          </div>

          <div className="border-solid border-4 border-light-blue-500">
            <div id="results">Results</div>
          </div>
        </div>
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

