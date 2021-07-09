import Link from 'next/link';
import { useRouter } from "next/router";

export const Tab = ({ icon, label, url, hasAction }) => {

	const router = useRouter();

	return (
		<Link href={url}>
			<a className={'flex items-center hover:bg-gray-light transition' + (router.pathname == {url} ? "active" : "")}>
				<div className="my-2 ml-3 bg-gray-light rounded w-5 h-5">
				</div>
				<div className="p-2 truncate text-13 font-regular mr-3">
					{ label }
				</div>
				{ hasAction && <div>action</div> }
			</a>
		</Link>
		);
};

export default Tab;