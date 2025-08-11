declare module 'phoenix' {
 
  export interface Placeholder {}
  const placeholder: Placeholder;
  export default placeholder;
}

declare module 'ws' {
  
  import { EventEmitter } from 'events';
  export interface WebSocketLike extends EventEmitter {
    readyState: number;
    send(data: any): void;
    close(code?: number, reason?: string): void;
  }
  const WS: { new(url: string, protocols?: string | string[]): WebSocketLike };
  export default WS;
}
