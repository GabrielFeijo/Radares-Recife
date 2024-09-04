import dynamic from 'next/dynamic';
import { useMemo } from 'react';

export default async function Home() {
	const Map = useMemo(
		() =>
			dynamic(() => import('@/components/map-component'), {
				loading: () => (
					<div className='flex  flex-col h-screen items-center justify-center gap-4'>
						<h1 className='text-2xl font-medium'>Carregando Mapa</h1>
						<div className='w-10 h-10 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]'></div>
					</div>
				),
				ssr: false,
			}),
		[]
	);

	return (
		<div className='w-screen h-screen'>
			<Map />
		</div>
	);
}
