import { getClientId } from '@/app/actions';
import { endpoints } from '@/lib/api/endpoints';
import { getAccessToken } from '@/lib/auth/auth';
import { CLIENT_ID } from '@/lib/util/client_id';
import { isLeft } from 'fp-ts/lib/Either';
import { Event, EventT } from 'models';
import { createContext, useEffect, useRef, ReactNode } from 'react';
import io, { Socket } from 'socket.io-client';

export const ROOT_CHANNEL = 'root';

type SIOCallback = (event: EventT) => void;

type SIOSubscribe = (channel: string, callback: SIOCallback) => void;
type SIOUnsubscribe = (channel: string) => void;

type SIOContextType = {
	sub: SIOSubscribe,
	unsub: SIOUnsubscribe
}

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
			path: '/api/v1/gateway/',
			auth: async (cb) => {
				const token = await getAccessToken(await getClientId());
				cb({
					token: token
				})
			}
		});

		ioInst.current.on('connect_error', (err) => {
			console.log(`GATEWAY CONNECTION ERROR: ${err}`)
			ioInst.current?.disconnect();
		})

		ioInst.current.on('event_message', (event) => {
			const decoded = Event.decode(event);
			if (isLeft(decoded)) {
				throw new Error(`malformed event`);
			}

			const data: EventT = decoded.right;

			// if client ID matches, the event originated from this client instance, so it should be ignored
			if (data.clientId === CLIENT_ID) {
				return;
			}

			switch(data.type) {
				case 'MESSAGE_SENT':
				case 'MESSAGE_DELETED':
				case 'MESSAGE_EDITED':
					ioChannels.current.get(`${data.serverId}_${data.channelId}`)?.(data);
					break;
				case 'CHANNEL_CREATED':
				case 'CHANNEL_DELETED':
				case 'CHANNEL_EDITED':
					ioChannels.current.get(`${data.serverId}`)?.(data);
					break;
			}
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
		<SIOContext.Provider value={{sub: subscribe, unsub: unsubscribe}}>
			{children}
		</SIOContext.Provider>
	)
}

export { SIOContext, SIOProvider };