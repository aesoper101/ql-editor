declare module "quill/core/emitter" {
  import EventEmitter from "eventemitter3";

  export interface ListenersMap {
    [key: string]: EventListenerOrEventListenerObject[];
  }

  declare class Emitter extends EventEmitter {
    listeners: ListenersMap;

    emit(...args: any[]);
    handleDOM(event: Event, ...args: string[]);
    listenDOM(
      eventName: string,
      node: HTMLElement,
      handler: EventListenerOrEventListenerObject
    );
  }

  export default Emitter;
}
