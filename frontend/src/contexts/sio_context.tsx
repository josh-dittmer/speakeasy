import { endpoints } from '@/lib/api/endpoints';
import { createContext, useEffect, useRef, ReactNode } from 'react';
import io, { Socket } from 'socket.io-client';

export const ROOT_CHANNEL = 'root';

type SIOCallback = (data: string) => void;

type SIOSubscribe = (channel: string, callback: SIOCallback) => void;
type SIOUnsubscribe = (channel: string) => void;

type SIOContextType = [
	subFunc: SIOSubscribe,
	unsubFunc: SIOUnsubscribe
]

const SIOContext = createContext<SIOContextType | null>(null);

function SIOProvider({ children } : { children: ReactNode }) {
	//console.log(url)
    const ioInst = useRef<Socket | null>(null);
    const ioChannels = useRef(new Map<string, SIOCallback>());

    const subscribe: SIOSubscribe = (channel: string, callback: SIOCallback) => {
		ioChannels.current.set(channel, callback);
    }

	const unsubscribe: SIOUnsubscribe = (channel: string) => {
		ioChannels.current.delete(channel);
	}

	useEffect(() => {
		ioInst.current = io(endpoints.MAIN_API, {
			path: '/api/v1/gateway/'
		});
		/*wsInst.current = new WebSocket(url);

		wsInst.current.onopen = () => {
			// websocket opened
			console.log('opened');
		};

		wsInst.current.onclose = () => {
			// websocket closed
		}*/

		/*wsInst.current.onmessage = (message) => {
			// do parsing stuff
			const serverId = '123';
			const channelId = '123';
			const data = {};

			// components subscription string format
			const wsChannelStr = `${serverId}_${channelId}`;

			const callback: WSCallback | undefined = wsChannels.current.get(wsChannelStr);

			if (callback) {
				callback(data); // for realtime messaging
			} else {
				wsChannels.current.get(serverId)?.(data); // for channel bar notifs
				wsChannels.current.get(ROOT_CHANNEL)?.(data); // for server bar notifs
			}
		}*/

		//return () => { wsInst.current?.close() }
	}, []);

	return (
		<SIOContext.Provider value={[subscribe, unsubscribe]}>
			{children}
		</SIOContext.Provider>
	)
}

export { SIOContext, SIOProvider };