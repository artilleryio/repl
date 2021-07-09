import Head from 'next/head';
import { getLayout } from '../components/layouts/DefaultLayout';
import HeadingBar from '../components/core/HeadingBar';
// import { useState } from 'react';
import { useAppContext } from '../src/context/state';

const Home = (props) => {
  // const state = useAppContext();
  // const [ url, setUrl ] = useState(state.avatarUrl);

  return (
    <div>
      <Head>
        <title>SuperREPL ⚡</title>
      </Head>

      <HeadingBar heading={props.heading} />
      <div className="app-content py-4 px-12">
        Default page
      </div>

    </div>
  )
}

export async function getStaticProps () {
  return {
    props: {
      heading: "SuperREPL"
    }
  };
};

Home.getLayout = getLayout;

export default Home;
