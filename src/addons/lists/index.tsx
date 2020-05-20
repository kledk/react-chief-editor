import { Addon } from "../../addon";
import {
  useRenderElement,
  ChiefElement,
  usePlugin,
  useOnKeyDown
} from "../../chief/chief";
import { renderElement } from "../../element-renderer";
import { Editor, Transforms, Element } from "slate";
import { ReactEditor, useSlate } from "slate-react";
import { isElementActive, isElementEmpty } from "../../element-utils";
import { getState } from "../../chief/chief-state";
import { getAncestor, getActiveNode } from "../../utils";

const LIST_ITEM = "list-item";

type ListElement = {
  type: "list-item" | "ordered-list" | "unordered-list";
} & ChiefElement;

export function ListsAddon(props: Addon) {
  usePlugin({
    normalizeNode: (normalizeNode, editor) => ([node, path]) => {
      if (node.type === "list-item") {
        const [parent] = Editor.parent(editor, path);
        if (
          parent &&
          parent.type !== "ordered-list" &&
          parent.type !== "unordered-list"
        ) {
          Transforms.setNodes(editor, { type: "paragraph" }, { at: path });
        }
      }
      return normalizeNode([node, path]);
    }
  });
  useRenderElement<ListElement>({
    typeMatch: ["list-item", "ordered-list", "unordered-list"],
    renderElement: props => {
      switch (props.element.type) {
        case "unordered-list":
          return renderElement(props, props.element.type, "ul");
        case "ordered-list":
          return renderElement(props, props.element.type, "ol");
        default:
          return renderElement(props, "list-item", "li");
      }
    }
  });

  useOnKeyDown({
    pattern: "enter",
    handler: (e, editor) => {
      const { elementType, element } = getState(editor);
      if (elementType !== LIST_ITEM) {
        return false;
      }
      let ancestor = getAncestor(editor, element as Element, 1);

      if (
        !ancestor ||
        !["ordered-list", "unordered-list"].includes(ancestor!.type as string)
      ) {
        return false;
      }
      e.preventDefault();
      if (!isElementEmpty(editor)) {
        Editor.withoutNormalizing(editor, () => {
          Transforms.insertNodes(editor, {
            type: "list-item",
            children: [{ text: "" }]
          });
        });
      } else {
        const active = getActiveNode(editor);
        if (!active) {
          return false;
        }
        const list = getAncestor(editor, active, 1) as Element;
        const listParent = getAncestor(editor, active, 2);

        if (listParent && listParent.children[0].type === "list-item") {
          //2. If nested then unwrap and move left
          Transforms.unwrapNodes(editor, {
            match: n => n.type === list.type,
            split: true
          });
        } else {
          //3. At top level so cannot unwrap, insert new paragraph and break from list
          toggleList(editor, list.type as string);
        }
      }

      return true;
    }
  });
  useOnKeyDown({
    pattern: "tab",
    handler: (e, editor) => {
      const { elementType, element } = getState(editor);
      if (!element || elementType !== "list-item") {
        return false;
      }

      let ancestor = getAncestor(editor, element, 1);
      if (
        !ancestor ||
        !["ordered-list", "unordered-list"].includes(ancestor!.type as string)
      ) {
        return false;
      }

      if (ancestor.children.length > 1) {
        e.preventDefault();
        const index = ancestor?.children.indexOf(element) - 1;
        if (ancestor.children[index].type !== "list-item") {
          // 3a. tab = move right. If the node above is a list then append to it.
          const otherList = ancestor.children[index] as Element;
          const destination = ReactEditor.findPath(
            editor,
            otherList.children[otherList.children.length - 1]
          );
          destination[destination.length - 1]++;
          Transforms.moveNodes(editor, {
            to: destination
          });
        } else {
          // 3b. otherwise, wrap the item in a new list and nest in parent
          Transforms.wrapNodes(editor, { type: ancestor.type, children: [] });
        }
        return true;
      }
      return false;
    }
  });
  useOnKeyDown({
    pattern: "shift+tab",
    handler: (e, editor) => {
      const { elementType, element } = getState(editor);
      if (!element || elementType !== "list-item") {
        return false;
      }

      let ancestor = getAncestor(editor, element, 1);
      if (
        !ancestor ||
        !["ordered-list", "unordered-list"].includes(ancestor!.type as string)
      ) {
        return false;
      }

      if (e.shiftKey) {
        let ancestor = getAncestor(editor, element, 2);
        // 1. tab+shift = move left to grandparent list if nested
        if (ancestor?.children.find(child => child.type === "list-item")) {
          Transforms.liftNodes(editor);
        } else {
          const options = {
            at: ReactEditor.findPath(editor, element)
          };
          // 2. tab+shift = unwrap and move to below parent if no grandparent list
          if (element?.children.length == 1) {
            Transforms.setNodes(editor, { type: "paragraph" }, options);
          } else {
            Transforms.unwrapNodes(editor, options);
          }
        }
        e.preventDefault();
        return true;
      }
      return false;
    }
  });
  return null;
}

export const toggleList = (editor: ReactEditor, type: string) => {
  const isActive = isElementActive(editor, type);

  Transforms.unwrapNodes(editor, {
    match: n => n.type === type,
    split: true
  });

  Editor.withoutNormalizing(editor, () => {
    Transforms.setNodes(editor, {
      type: isActive ? "paragraph" : "list-item"
    });

    if (!isActive) {
      const list = { type, children: [] };
      Transforms.wrapNodes(editor, list);
    }
  });
};
