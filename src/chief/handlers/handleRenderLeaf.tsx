import React from "react";
import {
  ReactEditor,

  RenderLeafProps
} from "slate-react";
import { InjectedRenderLeaf } from "../chief";
export function handleRenderLeaf(props: RenderLeafProps,
  editor: ReactEditor,
  renderLeafs: InjectedRenderLeaf[]) {
  let copy = { ...props };
  for (const renderLeaf of renderLeafs) {
    const leaf = renderLeaf.renderLeaf(copy, editor);
    if (leaf) {
      copy = { ...copy, children: leaf };
    }
  }
  return <span {...copy.attributes}>{copy.children}</span>;
}
