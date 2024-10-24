import localFont from 'next/font/local';
import './globals.css';
import { Metadata } from 'next';
import Client from '@/components/client/client';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

export const metadata: Metadata = {
	title: 'Speakeasy',
	description: 'Fullstack chat app by Josh Dittmer',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
	return (
		<html lang="en">
			<body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
				<Client>
					{children}
				</Client>
			</body>
		</html>
	);
}
