import Image from 'next/image';

const Avatar = ({ img, alt }) => (
	<div className="app-avatar bg-gray-light rounded-full overflow-hidden h-9 w-9">
		<Image src={ img } alt={ alt } width={36} height={36} />
	</div>
);

export default Avatar;