import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';
import Head from 'next/head';

const poppins = Poppins({
	subsets: ['latin'],
	weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
	title: 'Radares Recife',
	description:
		'Lista de equipamentos de monitoramento e fiscalização de trânsito (ex: lombada eletrônica, radar, foto sensor) com sua localização geográfica.',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='pt-BR'>
			<head>
				<meta
					http-equiv='Content-Security-Policy'
					content='upgrade-insecure-requests'
				/>
			</head>
			<body className={poppins.className}>{children}</body>
		</html>
	);
}
