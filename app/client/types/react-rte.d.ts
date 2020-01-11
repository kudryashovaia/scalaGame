declare module "react-rte" {
  import * as React from "react";

  type Format = "html" | "markdown";

  export class RichTextEditorValue {
    toString(format: Format): string;
  }

  interface RichTextEditorProps {
    value: RichTextEditorValue;
    onChange: (value: RichTextEditorValue) => void;
  }

  declare class RichTextEditor extends React.Component<RichTextEditorProps> {
    static createEmptyValue(): RichTextEditorValue;
    static createValueFromString(markup: string, format: Format): RichTextEditorValue;
  }
  export default RichTextEditor;
}
