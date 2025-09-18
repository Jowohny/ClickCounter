// server/middleware/websockets.ts
import { WebSocketServer, WebSocket } from 'ws'
import type { H3Event } from 'h3'

//have this shit global so it doesn't create new server everytime a mf goes on this site
declare global {
  var wss: WebSocketServer | undefined
}

let count = 0;
let viewerCount = 0

//goes through every request/event that goes through the server, in this case everytime a click is registered
export default defineEventHandler((event: H3Event) => {

    //checks if the socket exists as it is also a type of defined
    if (!globalThis.wss) {
        console.log('[WebSocket] Initializing server...')

        //if there is not socket, the server is created, mainly for instances when the site is launched and the first person registers a click
        const server = (event.node.req.socket as any)?.server
        if (!server) {
            console.error('[WebSocket] Server not found!')
            return
        }

        //creates a new server and sets it to the global variable
        globalThis.wss = new WebSocketServer({ server })


        //when someone connects or is already in the server, this function send the current viewer count to the user
        const incrementViewerCount = () => {
            globalThis.wss?.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({ count, viewerCount }))
                }
            });
        }

        //used to initially to connect the user to the server
        globalThis.wss.on('connection', (ws: WebSocket) => {
            console.log('[WebSocket] Client connected.')
            viewerCount++;
            incrementViewerCount();

            //when someone connects or is already in the server, this function send the current count to the user so they're up-to-date
            const broadcastCount = () => {
                globalThis.wss?.clients.forEach((client) => {
                    if (client.readyState === WebSocket.OPEN) {
                        client.send(JSON.stringify({ count, viewerCount }))
                    }
                });
            };

            //sends the initial count when connected 
            ws.send(JSON.stringify({ count,viewerCount }));

            /*in the vue file where the frontend is, we send an action to this server called increment, as as you would guess,
            it increments the global count variable located on this server and calls broadcastCount() so it updates the number*/
            ws.on('message', (message) => {
                try {
                    const data = JSON.parse(message.toString());
                    if (data.action === 'increment') {
                        count++;
                        broadcastCount();
                    }
                } catch (e) {
                    console.error(`[WebSocket] Failed to parse message: ${e}`);
                }
            });

            //literally just sends a message if someone closes their tab or something
            ws.on('close', () => {
                console.log('[WebSocket] Client disconnected.');
                viewerCount--;
                incrementViewerCount();
            });
        });
        console.log('[WebSocket] Server is running.');
    }

    /*honestly sort of an asspull, but apparently it starts off as an https REQUEST that has a special header,
    whatever that means, that comes in the form or 'upgrade, it checks that and if it has it, it creates a live 
    2 way connection... I'll look more into that. */
    const isWebSocketUpgrade = event.node.req.headers['upgrade'] === 'websocket';
    if (isWebSocketUpgrade) {
        //calls the server useless and lets the websocket take over
        event.node.res.end();
    }
});