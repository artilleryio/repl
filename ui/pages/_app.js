import App from 'next/app';
import DefaultLayout from '../components/layouts/DefaultLayout';
import 'tailwindcss/tailwind.css'
import '../styles/globals.css';

class MyApp extends App {
  render() {
    const { Component, pageProps, router } = this.props

    const getLayout = Component.getLayout || (page => <DefaultLayout>{ page }</DefaultLayout>)

    return getLayout(<Component {...pageProps} />)
  }
}

export default MyApp;
