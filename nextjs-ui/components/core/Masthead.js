import pkg from '/package.json';
import Link from 'next/link';
import Avatar from '../ui/Avatar';

const Masthead = () => (
	<Link href="/">
		<a className="flex items-center w-full cursor-pointer p-3 hover:bg-gray-light transition my-1">
			<div>
				<Avatar img="/app-logo.png" alt="Artillery Pro" />
			</div>
			<div className="ml-3">
				<h1 className="text-sm my-0 font-medium">Artillery Pro</h1>
				<span className="text-xs text-gray block mt-1">v{ pkg.version }</span>
			</div>
		</a>
	</Link>
);

export default Masthead;