import {createServer, type IncomingMessage, type Server as NodeServer, type ServerResponse} from "node:http";
import type {AddressInfo} from "node:net";

type HttpServer = NodeServer<typeof IncomingMessage, typeof ServerResponse>;

export function startServer(files: Files): Promise<Server> {
  return new Promise(resolve => {
    const server: HttpServer = createServer(write(files));
    server.listen(() => resolve(new Server(server)));
  });
}

export interface Files {
  [key: string]: string;
}

function write(files: Files) {
  return function (request: IncomingMessage, response: ServerResponse): void {
    const url: string = request.url!;
    if (files.hasOwnProperty(url)) {
      response.writeHead(200, {'Content-Type': contentType(url)});
      response.write(files[url]);
    } else {
      response.writeHead(404);
    }
    response.end();
  };
}

function contentType(url: string): string {
  if (url.endsWith('.js')) {
    return 'application/javascript';
  }
  return 'text/html; charset=utf-8';
}

export class Server {
  public readonly port: number;

  constructor(private server: HttpServer) {
    const address = this.server.address() as AddressInfo;
    this.port = address.port;
  }

  public async close(): Promise<void> {
    return new Promise(resolve => this.server.close(error => resolve()));
  }
}
