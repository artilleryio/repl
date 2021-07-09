import Head from 'next/head';
import { getLayout } from '../../components/layouts/DefaultLayout';
import ContextBar from '../../components/core/ContextBar';
import HeadingBar from '../../components/core/HeadingBar';
// import { useState } from 'react';
import { useAppContext } from '../../src/context/state';

const LoadTestView = (props) => {

  const state = useAppContext();
  // const [ url, setUrl ] = useState(state.avatarUrl);

  return (
    <div>
      <Head>
        <title>Artillery Pro</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <ContextBar />
      <HeadingBar heading={props.heading} />
      <div className="app-content py-4 px-12 overflow-scroll">
        
      </div>

    </div>
  )
}

export async function getStaticPaths() {
  return {
    paths: [
      '/load-tests/test'
    ],
    fallback: true,
  }
}

export async function getStaticProps () {
  return {
    props: {
      heading: "Load test name"
    }
  };
};

LoadTestView.getLayout = getLayout;

export default LoadTestView;