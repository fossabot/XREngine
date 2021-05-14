import { initializeEngineServer } from "./initializeEngineServer";
import { DefaultNetworkSchema } from "@xrengine/engine/src/networking/templates/DefaultNetworkSchema";
import { SocketWebRTCServerTransport } from "./SocketWebRTCServerTransport";
import config from '@xrengine/server-core/src/appconfig';

// Patch XHR for FileLoader in threejs
import { XMLHttpRequest } from 'xmlhttprequest';
(globalThis as any).XMLHttpRequest = XMLHttpRequest;

const networkSchema = {
  ...DefaultNetworkSchema,
  transport: SocketWebRTCServerTransport
};

const options = {
  networking: {
    schema: networkSchema,
  },
  publicPath: config.client.url
};

export class WebRTCGameServer {
  static instance: WebRTCGameServer = null
  constructor(app: any) {
    (options.networking as any).app = app;
    WebRTCGameServer.instance = this;
  }
  initialize() {
    return initializeEngineServer(options);
  }
}
