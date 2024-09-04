'use client';
import { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

import allRadars from '@/data/radars.json';

interface Radar {
	_id: number;
	latitude: number;
	longitude: number;
	local_instalacao: string;
	faixas_fiscalizadas: string;
	sentido_fiscalizacao: string;
	identificacao_equipamento: string;
	tipo_equipamento: string;
	velocidade_fiscalizada: string;
}

interface MapProps {
	center?: [number, number];
	zoom?: number;
}

const defaults = {
	zoom: 15,
};

const defaultCenter = {
	lat: -8.052643905437522,
	lng: -34.88519751855592,
};

const MapComponent: React.FC<MapProps> = ({
	center = defaultCenter,
	zoom = defaults.zoom,
}) => {
	const radars = allRadars.result.records;
	const [activeMarker, setActiveMarker] = useState<number | null>(null);

	const customIcon = new L.Icon({
		iconUrl: '/icon.webp',
		iconSize: [30, 30],
	});

	return (
		<MapContainer
			center={center}
			zoom={zoom}
			style={{ height: '100vh', width: '100%' }}
			scrollWheelZoom={true}
			attributionControl={false}
		>
			<TileLayer url='https://www.google.cn/maps/vt?lyrs=m@221097413,traffic&x={x}&y={y}&z={z}' />
			{radars.map((radar) => (
				<Marker
					key={radar._id}
					position={[radar.latitude, radar.longitude]}
					title={radar.local_instalacao}
					icon={customIcon}
					eventHandlers={{
						click: () => {
							setActiveMarker(radar._id);
						},
					}}
				>
					<Tooltip
						offset={[15, 0]}
						opacity={1}
						permanent
						className='font-bold'
					>
						{radar.velocidade_fiscalizada}
					</Tooltip>
					{activeMarker === radar._id && (
						<Popup autoClose>
							<section className='text-black max-w-52 space-y-2 font-poppins'>
								<h2>Local: {radar.local_instalacao}</h2>
								<p>Faixas Fiscalizadas: {radar.faixas_fiscalizadas}</p>
								<p>Sentido: {radar.sentido_fiscalizacao}</p>
								<p>Radar: {radar.identificacao_equipamento}</p>
								<p>Tipo: {radar.tipo_equipamento}</p>
								<p>
									Velocidade Fiscalizada: {radar.velocidade_fiscalizada} Km/h
								</p>
								<p>
									Ver no Maps:{' '}
									<a
										href={`https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${radar.latitude},${radar.longitude}`}
										target='_blank'
										rel='noreferrer'
									>
										Clique Aqui
									</a>
								</p>
							</section>
						</Popup>
					)}
				</Marker>
			))}
		</MapContainer>
	);
};

export default MapComponent;
