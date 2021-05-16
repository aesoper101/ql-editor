import { ComponentOptions, HandlerFunc } from "../ui/toolbar/type";

export interface ToolbarStringMap {
  [key: string]: string | ComponentOptions[];
}

export type ToolbarConfig = string | ToolbarStringMap;

export interface Options {
  container?: string | HTMLElement | ToolbarConfig[][];
  handlers?: Record<string, HandlerFunc>;
}

export const DEFAULT_TOOLBAR_OPTIONS: Options = {
  container: [
    ["undo", "redo", "painter", "clean", "|"],
    [
      {
        font: [
          { label: "宋体", value: "宋体", isDefault: true },
          { label: "微软雅黑", value: "微软雅黑" },
          { label: "Comic Sans MS", value: "Comic Sans MS" },
          { label: "Times New Roman", value: "Times New Roman" },
          { label: "等线", value: "等线" },
          { label: "等线 Light", value: "等线 Light" },
          { label: "仿宋", value: "仿宋" },
          { label: "黑体", value: "黑体" },
          { label: "楷体", value: "楷体" },
          { label: "微软雅黑 Light", value: "微软雅黑 Light" },
          { label: "新宋体", value: "新宋体" },
          { label: "Arial", value: "Arial" },
          { label: "Calibri", value: "Calibri" },
          { label: "Courier New", value: "Courier New" },
          { label: "Helvetica", value: "Helvetica" },
          { label: "Microsoft JhengHei", value: "Microsoft JhengHei" },
          {
            label: "Microsoft JhengHei Light",
            value: "Microsoft JhengHei Light",
          },
          { label: "Microsoft JhengHei UI", value: "Microsoft JhengHei UI" },
          {
            label: "Microsoft JhengHei UI Light",
            value: "Microsoft JhengHei UI Light",
          },
          { label: "Microsoft YaHei UI", value: "Microsoft YaHei UI" },
          {
            label: "Microsoft YaHei UI Light",
            value: "Microsoft YaHei UI Light",
          },
          { label: "Verdana", value: "Verdana" },
          { label: "Arial Black", value: "Arial Black" },
          { label: "Bahnschrift", value: "Bahnschrift" },
          { label: "Bahnschrift Condensed", value: "Bahnschrift Condensed" },
          { label: "Bahnschrift Light", value: "Bahnschrift Light" },
          {
            label: "Bahnschrift Light Condensed",
            value: "Bahnschrift Light Condensed",
          },
          {
            label: "Bahnschrift Light SemiCondensed",
            value: "Bahnschrift Light SemiCondensed",
          },
          { label: "Bahnschrift SemiBold", value: "Bahnschrift SemiBold" },
          {
            label: "Bahnschrift SemiBold Condensed",
            value: "Bahnschrift SemiBold Condensed",
          },
          {
            label: "Bahnschrift SemiCondensed",
            value: "Bahnschrift SemiCondensed",
          },
          { label: "Bahnschrift SemiLight", value: "Bahnschrift SemiLight" },
          {
            label: "Bahnschrift SemiLight Condensed",
            value: "Bahnschrift SemiLight Condensed",
          },
          { label: "Calibri Light", value: "Calibri Light" },
          { label: "Cambria", value: "Cambria" },
          { label: "Cambria Math", value: "Cambria Math" },
          { label: "Candara", value: "Candara" },
          { label: "Candara Light", value: "Candara Light" },
          { label: "Consolas", value: "Consolas" },
          { label: "Constantia", value: "Constantia" },
          { label: "Corbel", value: "Corbel" },
          { label: "Corbel Light", value: "Corbel Light" },
          { label: "Courier", value: "Courier" },
          { label: "Ebrima", value: "Ebrima" },
          { label: "Franklin Gothic", value: "Franklin Gothic" },
          { label: "Franklin Gothic Medium", value: "Franklin Gothic Medium" },
          { label: "Gabriola", value: "Gabriola" },
          { label: "Gadugi", value: "Gadugi" },
          { label: "Georgia", value: "Georgia" },
          { label: "HoloLens MDL2 Assets", value: "HoloLens MDL2 Assets" },
          { label: "Impact", value: "Impact" },
          { label: "Ink Free", value: "Ink Free" },
          { label: "Javanese Text", value: "Javanese Text" },
          { label: "Leelawadee UI", value: "Leelawadee UI" },
          { label: "Lucida Console", value: "Lucida Console" },
          { label: "Lucida Sans Unicode", value: "Lucida Sans Unicode" },
          { label: "Malgun Gothic", value: "Malgun Gothic" },
          { label: "Marlett", value: "Marlett" },
          { label: "Microsoft Himalaya", value: "Microsoft Himalaya" },
          { label: "Microsoft New Tai Lue", value: "Microsoft New Tai Lue" },
          { label: "Microsoft PhagsPa", value: "Microsoft PhagsPa" },
          { label: "Microsoft Sans Serif", value: "Microsoft Sans Serif" },
          { label: "Microsoft Tai Le", value: "Microsoft Tai Le" },
          { label: "Microsoft Yi Baiti", value: "Microsoft Yi Baiti" },
          { label: "MingLiU_HKSCS-ExtB", value: "MingLiU_HKSCS-ExtB" },
          { label: "MingLiU-ExtB", value: "MingLiU-ExtB" },
          { label: "Mongolian Baiti", value: "Mongolian Baiti" },
          { label: "MS Gothic", value: "MS Gothic" },
          { label: "MS PGothic", value: "MS PGothic" },
          { label: "MS UI Gothic", value: "MS UI Gothic" },
          { label: "MV Boli", value: "MV Boli" },
          { label: "Myanmar Text", value: "Myanmar Text" },
          { label: "Nirmala UI", value: "Nirmala UI" },
          { label: "Palatino Linotype", value: "Palatino Linotype" },
          { label: "PMingLiU-ExtB", value: "PMingLiU-ExtB" },
          { label: "Segoe MDL2 Assets", value: "Segoe MDL2 Assets" },
          { label: "Segoe Print", value: "Segoe Print" },
          { label: "Segoe Script", value: "Segoe Script" },
          { label: "Segoe UI", value: "Segoe UI" },
          { label: "Segoe UI Black", value: "Segoe UI Black" },
          { label: "Segoe UI Emoji", value: "Segoe UI Emoji" },
          { label: "Segoe UI Historic", value: "Segoe UI Historic" },
          { label: "Segoe UI Light", value: "Segoe UI Light" },
          { label: "Segoe UI Semibold", value: "Segoe UI Semibold" },
          { label: "Segoe UI Symbol", value: "Segoe UI Symbol" },
          { label: "SimSun-ExtB", value: "SimSun-ExtB" },
          { label: "Sitka Banner", value: "Sitka Banner" },
          { label: "Sitka ImageDisplay", value: "Sitka ImageDisplay" },
          { label: "Sitka Heading", value: "Sitka Heading" },
          { label: "Sitka Small", value: "Sitka Small" },
          { label: "Sitka Subheading", value: "Sitka Subheading" },
          { label: "Sitka Text", value: "Sitka Text" },
          { label: "Sylfaen", value: "Sylfaen" },
          { label: "Symbol", value: "Symbol" },
          { label: "Tahoma", value: "Tahoma" },
          { label: "Times", value: "Times" },
          { label: "Trebuchet MS", value: "Trebuchet MS" },
          { label: "Yu Gothic", value: "Yu Gothic" },
          { label: "Yu Gothic Light", value: "Yu Gothic Light" },
          { label: "Yu Gothic Medium", value: "Yu Gothic Medium" },
          { label: "Yu Gothic UI", value: "Yu Gothic UI" },
          { label: "Yu Gothic UI Light", value: "Yu Gothic UI Light" },
          { label: "Yu Gothic UI Semibold", value: "Yu Gothic UI Semibold" },
        ],
      },
      {
        size: [
          { label: "10", value: "10px" },
          { label: "12", value: "12px" },
          { label: "14", value: "14px", isDefault: true },
          { label: "16", value: "16px" },
          { label: "18", value: "18px" },
          { label: "20", value: "20px" },
          { label: "22", value: "24px" },
          { label: "26", value: "26px" },
          { label: "28", value: "28px" },
          { label: "30", value: "30px" },
          { label: "36", value: "36px" },
        ],
      },
      "|",
    ],
    [
      "bold",
      "underline",
      "italic",
      "strike",
      "color",
      "background",
      {
        script: [
          { label: "上标", value: "super" },
          { label: "下标", value: "sub" },
        ],
      },
      "|",
    ],
    [
      {
        header: [
          { label: "正文", value: "" },
          { label: "一级标题", value: "h1" },
          { label: "二级标题", value: "h2" },
          { label: "三级标题", value: "h3" },
        ],
      },
    ],
    [
      { align: "left" },
      { align: "right" },
      { align: "center" },
      { align: "justify" },
      { indent: "+1" },
      { indent: "-1" },
      {
        lineHeight: [
          { label: "1", value: "1" },
          { label: "1.15", value: "1.15" },
          { label: "1.5", value: "1.5" },
          { label: "2", value: "2" },
          { label: "2.5", value: "2.5" },
          { label: "3", value: "3" },
        ],
      },
    ],
    [
      "todo",
      {
        ordered: [
          { label: "无", value: "" },
          { label: "一、二、三", value: "cjk-ideographic" },
          { label: "1.2.3", value: "decimal" },
          // { label: "①②③", value: "circle-decimal" },
          { label: "a,b,c", value: "lower-alpha" },
          { label: "1)2)3)", value: "decimal-right-comma" },
          { label: "(1)(2)(3)", value: "decimal-comma" },
        ],
      },
      {
        bullet: [
          { label: "无", value: "" },
          { label: "带填充效果的大圆项目符号", value: "disc" },
          { label: "带填充效果的钻石棱形项目符号", value: "prismatic" },
          // { label: "箭头项目符号", value: "3" },
          { label: "选中标记项目符号", value: "check" },
        ],
      },
    ],
    [
      {
        insert: [
          { label: "图片", value: "image" },
          // { label: "表格", value: "table" },
          { label: "链接", value: "link" },
          { label: "视频", value: "video" },
          { label: "音频", value: "audio" },
          { label: "水平线", value: "divider" },
          { label: "代码块", value: "code-block" },
          { label: "引用", value: "blockquote" },
          // { label: "附件", value: "attachment" },
        ],
      },
      // "print",
    ],
  ],
  handlers: {},
};