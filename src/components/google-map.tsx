'use client';

import {
	GoogleMap,
	InfoWindow,
	Marker,
	useLoadScript,
} from '@react-google-maps/api';
import { useState } from 'react';

import allRadars from '@/data/radars.json';

const center = {
	lat: -8.052643905437522,
	lng: -34.88519751855592,
};

export interface IRadar {
	_id: number;
	tipo_equipamento: string;
	registro_inmetro: string;
	numero_serie_fabricante: string;
	identificacao_equipamento: string;
	local_instalacao: string;
	sentido_fiscalizacao: string;
	latitude: number;
	longitude: number;
	faixas_fiscalizadas: number;
	velocidade_fiscalizada: string;
	vmd: number;
	periodo_vmd: string;
}

const GoogleMapComponent = () => {
	const radars = allRadars.result.records;

	const [activeMarker, setActiveMarker] = useState<number | null>(null);

	const { isLoaded } = useLoadScript({
		googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
	});

	if (!isLoaded)
		return (
			<div className='flex  flex-col h-screen items-center justify-center gap-4'>
				<h1 className='text-2xl font-medium'>Carregando Mapa</h1>
				<div className='w-10 h-10 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]'></div>
			</div>
		);

	return (
		<GoogleMap
			zoom={15}
			center={center}
			mapContainerClassName='map'
			mapContainerStyle={{ width: '100%', height: '100vh', margin: 'auto' }}
			options={{
				styles: [
					{
						featureType: 'poi',
						stylers: [{ visibility: 'off' }],
					},
				],
			}}
		>
			{radars.length > 0 &&
				radars.map((radar) => (
					<Marker
						key={radar._id}
						position={{ lat: radar.latitude, lng: radar.longitude }}
						title={radar.local_instalacao}
						label={{
							text: radar.velocidade_fiscalizada,
							className: 'font-bold',
						}}
						onClick={() => setActiveMarker(radar._id)}
						icon={{
							url: `/speed-limit.svg`,
							scaledSize: new window.google.maps.Size(30, 30),
						}}
					>
						{activeMarker === radar._id ? (
							<InfoWindow onCloseClick={() => setActiveMarker(null)}>
								<section className='text-black max-w-52 space-y-2 font-poppins'>
									<h2>Local: {radar.local_instalacao}</h2>
									<p>Faixas Fiscalizadas: {radar.faixas_fiscalizadas}</p>
									<p>Sentido: {radar.sentido_fiscalizacao}</p>
									<p>Radar: {radar.identificacao_equipamento}</p>
									<p>Tipo: {radar.tipo_equipamento}</p>
									<p>
										Velocidade Fiscalizada: {radar.velocidade_fiscalizada} Km/h
									</p>
								</section>
							</InfoWindow>
						) : null}
					</Marker>
				))}
		</GoogleMap>
	);
};

export default GoogleMapComponent;
