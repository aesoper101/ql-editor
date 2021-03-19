import Emitter from "quill/core/emitter";

export type FormatChange = (format: string, formatValue?: string) => void;

class FormatEvent {
  private emitter: Emitter;

  static EventName = "format-change";

  constructor(emitter: Emitter) {
    this.emitter = emitter;
  }

  emit(format: string, formatValue?: string) {
    this.emitter.emit(FormatEvent.EventName, format, formatValue);
  }

  on(fn: FormatChange) {
    this.emitter.on(
      FormatEvent.EventName,
      (format: string, formatValue?: string) => {
        fn(format, formatValue);
      }
    );
    return;
  }
}

export default FormatEvent;
