import React from "react";
import { RenderLeafProps, ReactEditor, RenderElementProps } from "slate-react";

export interface Addon {
  name?: string;
  renderLeaf?: (
    props: RenderLeafProps,
    editor: ReactEditor
  ) => JSX.Element | undefined;
  renderElement?: (
    props: RenderElementProps,
    editor: ReactEditor
  ) => JSX.Element | undefined;
  withPlugin?(editor: ReactEditor): ReactEditor;
}
