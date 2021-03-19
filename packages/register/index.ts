import Quill from "quill";
import { FontStyle } from "../formats/font";
import { FloatStyle } from "../formats/float";
import { SizeStyle } from "../formats/size";
import IndentStyle from "../formats/indent";
import { LineHeightStyle } from "../formats/line-height";
import { AlignStyle } from "../formats/align";
import Link from "../formats/link";
import Video from "../formats/video";
import Audio from "../formats/audio";
import Image from "../formats/image";
import DividerBlot from "../formats/divider";
import Toolbar from "../modules/toolbar";
import BeeTheme from "../themes/bee";

Quill.register(
  {
    "attributors/style/font": FontStyle,
    "attributors/style/float": FloatStyle,
    "attributors/style/size": SizeStyle,
    "attributors/style/indent": IndentStyle,
    "attributors/style/lineHeight": LineHeightStyle,

    "formats/align": AlignStyle,
    "formats/font": FontStyle,
    "formats/size": SizeStyle,
    "formats/float": FloatStyle,

    "formats/indent": IndentStyle,
    "formats/lineHeight": LineHeightStyle,

    "formats/link": Link,

    "formats/image": Image,
    "formats/video": Video,
    "formats/audio": Audio,

    "formats/divider": DividerBlot,

    "modules/toolbar": Toolbar,

    // "modules/resize": Resize,

    "themes/bee": BeeTheme,
  },
  true
);
