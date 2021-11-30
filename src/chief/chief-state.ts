import { ReactEditor, useSlate } from "slate-react";
import { Point, Editor, Range, Node } from "slate";
import { ChiefElement, isChiefElement } from "./chief";
import { ChiefEditor } from "../typings";

interface ChiefState {
  editor: ReactEditor;
  element?: ChiefElement | Editor | undefined;
  elementType?: string;
  point?: Point;
  isElementEmpty: boolean;
  selection?: Range | null;
  isSelectionCollapsed: boolean;
  isSelectionExpanded: boolean;
}

export function getState(editor: ChiefEditor): ChiefState {
  const { selection } = editor;
  const point = selection ? selection.focus : undefined;
  const [element] = point ? Editor.parent(editor, point) : [];

  let isSelectionExpanded = false;
  let isSelectionCollapsed = true;
  if (selection) {
    isSelectionExpanded = Range.isExpanded(selection);
    isSelectionCollapsed = Range.isCollapsed(selection);
  }

  let isElementEmpty = true;

  if (element) {
    isElementEmpty = Node.string(element).length == 0;
  }
  let elementType: string | undefined = undefined;

  if (element && isChiefElement(element)) {
    elementType = element.type;
  }

  return {
    editor,
    // TODO:: THIS
    // @ts-ignore
    element,
    elementType,
    point,
    selection,
    isElementEmpty,
    isSelectionExpanded,
    isSelectionCollapsed,
  };
}
