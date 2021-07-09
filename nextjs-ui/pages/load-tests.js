import Head from 'next/head';
import { getLayout } from '../components/layouts/DefaultLayout';
import ContextBar from '../components/core/ContextBar';
import HeadingBar from '../components/core/HeadingBar';
import StatusDot from '../components/ui/StatusDot'; // temp
// import { useState } from 'react';
import { useAppContext } from '../src/context/state';

const LoadTests = (props) => {

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
        
        <table className="w-full text-left">
          <thead className="text-gray text-xs">
            <tr className="font-medium">
              <th colSpan="1">Status</th>
              <th colSpan="1">Test ID</th>
              <th colSpan="1">Name</th>
              <th colSpan="1">Tag(s)</th>
              <th colSpan="1">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><StatusDot status="ERROR" /></td>
              <td>90809727-d396c3...</td>
              <td>cms-edit-update-api</td>
              <td>Group of tags right here</td>
              <td>View report →</td>
            </tr>
            <tr>
              <td><StatusDot status="COMPLETED" /></td>
              <td>90809727-d396c3...</td>
              <td>cms-edit-update-api</td>
              <td>Group of tags right here</td>
              <td>View report →</td>
            </tr>
            <tr>
              <td><StatusDot /></td>
              <td>90809727-d396c3...</td>
              <td>cms-edit-update-api</td>
              <td>Group of tags right here</td>
              <td>View report →</td>
            </tr>
          </tbody>
      </table>

      </div>

    </div>
  )
}

export async function getStaticProps () {
  return {
    props: {
      heading: "Load Tests"
    }
  };
};

LoadTests.getLayout = getLayout;

export default LoadTests;