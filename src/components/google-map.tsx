'use client';

import { getData } from '@/services/get-data';
import {
	GoogleMap,
	InfoWindow,
	Marker,
	useLoadScript,
} from '@react-google-maps/api';
import { useEffect, useState } from 'react';

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
	const [currentLocation, setCurrentLocation] = useState<{
		lat: number;
		lng: number;
	} | null>(null);
	const [activeMarker, setActiveMarker] = useState<number | null>(null);
	const [radars, setRadars] = useState<IRadar[]>([]);

	const { isLoaded } = useLoadScript({
		googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
	});

	if (!isLoaded) return <div>Loading...</div>;

	async function fetchData() {
		const response = await getData();
		setRadars(response.result.records);
	}

	return (
		<GoogleMap
			zoom={15}
			center={center}
			mapContainerClassName='map'
			mapContainerStyle={{ width: '100%', height: '100vh', margin: 'auto' }}
			onLoad={fetchData}
			options={{
				styles: [
					{
						featureType: 'poi',
						stylers: [{ visibility: 'off' }],
					},
				],
			}}
		>
			{currentLocation && <Marker position={currentLocation} />}
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
								<div className='text-black max-w-52'>
									<h3>Radar: {radar.identificacao_equipamento}</h3>
									<p>Tipo: {radar.tipo_equipamento}</p>
									<p>Sentido: {radar.sentido_fiscalizacao}</p>
									<p>Local: {radar.local_instalacao}</p>
									<p>
										Velocidade Fiscalizada: {radar.velocidade_fiscalizada} Km/h
									</p>
								</div>
							</InfoWindow>
						) : null}
					</Marker>
				))}
		</GoogleMap>
	);
};

export default GoogleMapComponent;
