import Masthead from '../core/Masthead';
import Tab from '../ui/Tab';

const Sidebar = () => (
	<aside className="app-sidebar bg-beige border-r border-gray-light flex flex-col">
		<div className="flex-grow-0 flex-shrink-0 block">
			<Masthead />
		</div>
		<div className="overflow-x-hidden overflow-y-auto">
			<div className="mt-9">
				<Tab label="Profile" url="/" hasAction={false} />
			</div>
			<div className="mt-10">
				<h5 className="my-3 mx-4 text-11 font-medium text-gray">Tools</h5>
				<div>
					<Tab label="Load Tests" url="/load-tests" hasAction={false} />
					<Tab label="REPL" url="/repl" hasAction={false} />
					<Tab label="Settings" url="/settings" hasAction={false} />
				</div>
			</div>
		</div>
		<div className="flex-sidebar mt-auto bg-beige pt-4 mb-4 truncate">
			<Tab label="Help & Feedback" url="/help" hasAction={false} />
		</div>
	</aside>
);

export default Sidebar;