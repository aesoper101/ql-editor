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
import Uploader from "../modules/uploader";
import TodoItem from "../formats/todo";
import OrderedItem from "../formats/ordered";
import BulletItem from "../formats/bullet";
import { ColorStyle } from "../formats/color";
import OrderedContainer from "../formats/ordered";
import TodoContainer from "../formats/todo";
import BulletContainer from "../formats/bullet";
import Resize from "../modules/resize";

Quill.register(
  {
    "attributors/style/font": FontStyle,
    "attributors/style/float": FloatStyle,
    "attributors/style/size": SizeStyle,
    "attributors/style/indent": IndentStyle,
    "attributors/style/lineHeight": LineHeightStyle,
    "attributors/style/color": ColorStyle,

    "formats/align": AlignStyle,
    "formats/font": FontStyle,
    "formats/size": SizeStyle,
    "formats/float": FloatStyle,
    "formats/color": ColorStyle,

    "formats/indent": IndentStyle,
    "formats/lineHeight": LineHeightStyle,

    "formats/link": Link,
    "format/ordered-container": OrderedContainer,
    "format/bullet-container": BulletContainer,
    "format/todo-container": TodoContainer,
    "formats/todo": TodoItem,
    "formats/ordered": OrderedItem,
    "formats/bullet": BulletItem,

    "formats/image": Image,
    "formats/video": Video,
    "formats/audio": Audio,

    "formats/divider": DividerBlot,

    "modules/toolbar": Toolbar,

    "modules/resize": Resize,
    "modules/uploader": Uploader,

    "themes/bee": BeeTheme,
  },
  true
);
