declare module "quill/blots/text" {
  import { TextBlot } from "parchment/src/parchment";

  function escapeText(text): string;

  declare class Text extends TextBlot {}

  export default Text;

  export { escapeText };
}
