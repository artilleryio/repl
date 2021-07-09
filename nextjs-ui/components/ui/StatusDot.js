const StatusDot = ({ status }) => {

	if (status === 'COMPLETED') return <div className="app-status-dot bg-green rounded-full overflow-hidden h-1.5 w-1.5"></div>

	if (status === 'ERROR') return <div className="app-status-dot bg-red rounded-full overflow-hidden h-1.5 w-1.5"></div>

	return (
		<div className="app-status-dot bg-yellow rounded-full overflow-hidden h-1.5 w-1.5"></div>
	)
};

export default StatusDot;