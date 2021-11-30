import { Editor, Transforms, Node, Element } from "slate";

export const toggleElement = (editor: Editor, type: string) => {
  const isActive = isElementActive(editor, type);
  const { selection } = editor;
  if (!selection) {
    return;
  }
  Transforms.setNodes(editor, {
    type: isActive ? "paragraph" : type,
    autoFocus: true,
    at: selection.focus,
  });
};

export const isElementActive = (editor: Editor, type: string) => {
  const { selection } = editor;
  if (!selection) {
    return false;
  }
  const [match] = Editor.nodes(editor, {
    at: selection,
    match: (n) => Element.isElement(n) && n.type === type,
  });
  return !!match;
};

export const isElementEmpty = (editor: Editor) => {
  const { selection } = editor;

  if (selection) {
    const [node] = Editor.parent(editor, selection.focus);
    return Node.string(node).length === 0;
  }
  return false;
};
