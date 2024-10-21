import { createContext, useEffect, useRef, ReactNode } from 'react';

export const ROOT_CHANNEL = 'root';

type WSCallback = (data: string) => void;

type WSSubscribe = (channel: string, callback: WSCallback) => void;
type WSUnsubscribe = (channel: string) => void;

type WSContextType = [
	subFunc: WSSubscribe,
	unsubFunc: WSUnsubscribe
]

const WSContext = createContext<WSContextType | null>(null);

function WSProvider({ children, url } : { children: ReactNode, url: string}) {
	//console.log(url)
    const wsInst = useRef<WebSocket | null>(null);
    const wsChannels = useRef(new Map<string, WSCallback>());

    const subscribe: WSSubscribe = (channel: string, callback: WSCallback) => {
		wsChannels.current.set(channel, callback);
    }

	const unsubscribe: WSUnsubscribe = (channel: string) => {
		wsChannels.current.delete(channel);
	}

	useEffect(() => {
		/*wsInst.current = new WebSocket(url);

		wsInst.current.onopen = () => {
			// websocket opened
		};

		wsInst.current.onclose = () => {
			// websocket closed
		}

		wsInst.current.onmessage = (message) => {
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
		}

		return () => { wsInst.current?.close() }*/
	}, []);

	return (
		<WSContext.Provider value={[subscribe, unsubscribe]}>
			{children}
		</WSContext.Provider>
	)
}

export { WSContext, WSProvider };