import { getClientId } from '@/app/actions';
import { endpoints } from '@/lib/api/endpoints';
import { Tags } from '@/lib/api/requests';
import { getAccessToken } from '@/lib/auth/auth';
import { getChannelDataKey } from '@/lib/queries/get_channel_data';
import { getServerDataKey } from '@/lib/queries/get_server_data';
import { getServerListKey } from '@/lib/queries/get_server_list';
import { CLIENT_ID } from '@/lib/util/client_id';
import { useQueryClient } from '@tanstack/react-query';
import { isLeft } from 'fp-ts/lib/Either';
import { Event, EVENT_NAME, EventT } from 'models';
import { usePathname } from 'next/navigation';
import { ReactNode, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

export default function SIOClient({ children }: { children: ReactNode }) {
    const client = useQueryClient();

    const ioInst = useRef<Socket | null>(null);

    useEffect(() => {
		ioInst.current = io(endpoints.MAIN_API, {
			path: '/api/v1/gateway/',
			auth: async (cb) => {
				const token = await getAccessToken(await getClientId());
				cb({
					token: token,
					clientId: CLIENT_ID
				})
			}
		});

		ioInst.current.on('connect_error', (err) => {
			console.log(`GATEWAY CONNECTION ERROR: ${err}`)
			ioInst.current?.disconnect();
		})

        ioInst.current.on(EVENT_NAME, (event) => {
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
                    if (data.channelId) {
					    client.invalidateQueries({ queryKey: [Tags.channelData, getChannelDataKey(data.channelId)] });
                    }
					break;
				case 'CHANNEL_CREATED':
                case 'CHANNEL_DELETED':
                case 'CHANNEL_EDITED':
                    if (data.serverId) {
                        client.invalidateQueries({ queryKey: [Tags.serverData, getServerDataKey(data.serverId)] });    
                    }
                    break;
				case 'SERVER_EDITED':
				case 'SERVER_USER_JOIN':
				case 'SERVER_USER_LEAVE':
                    if (data.serverId) {
                        client.invalidateQueries({ queryKey: [getServerListKey()]});
                        client.invalidateQueries({ queryKey: [Tags.serverData, getServerDataKey(data.serverId)] });
                    }
					break;
				case 'USER_PROFILE_EDITED':
				case 'USER_STATUS_CHANGE':
                    client.invalidateQueries({ queryKey: [Tags.serverData] });
					break;
			}
		});
	}, []);

    return children;
}