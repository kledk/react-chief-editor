import { isElementActive } from "../../element-utils";
import { Transforms, Editor, Element } from "slate";
import { TYPE_LIST_ITEM } from ".";

export const toggleList = (editor: Editor, type: string) => {
  const isActive = isElementActive(editor, type);
  Transforms.unwrapNodes(editor, {
    match: (n) => Element.isElement(n) && n.type === type,
    split: true,
  });
  Editor.withoutNormalizing(editor, () => {
    Transforms.setNodes(editor, {
      type: isActive ? "paragraph" : TYPE_LIST_ITEM,
    });

    if (!isActive) {
      const list = {
        type,
        children: [],
      };
      Transforms.wrapNodes(editor, list);
    }
  });
};
