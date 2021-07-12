import Head from 'next/head';
import { getLayout } from '../components/layouts/DefaultLayout';
import HeadingBar from '../components/core/HeadingBar';
import Editor from '../components/core/Editor';

const Home = (props) => {
  return (
    <div>
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

