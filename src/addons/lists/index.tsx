//@ts-nocheck
import { toggleList } from "./transforms";
import { ChiefElement, InjectedRenderElement } from "../../chief/chief";
import { useRenderElement } from "../../chief/hooks/use-render-element";
import { useOnKeyDown } from "../../chief/hooks/use-on-key-down";
import { usePlugin } from "../../chief/hooks/use-plugin";
import { renderElement } from "../../element-renderer";
import { Editor, Transforms, Element, Range, Node } from "slate";
import { ReactEditor } from "slate-react";
import { isElementEmpty } from "../../element-utils";
import { getState } from "../../chief/chief-state";
import { getAncestor, getActiveNode } from "../../utils";
import { AddonProps } from "../../addon";
import styled from "styled-components";
import { iPresenter } from "../../chief";

export const TYPE_LIST_ITEM = "list-item";
export const TYPE_UNORDERED_LIST = "unordered-list";
export const TYPE_ORDERED_LIST = "ordered-list";
export const LIST_TYPES = [
  TYPE_LIST_ITEM,
  TYPE_UNORDERED_LIST,
  TYPE_ORDERED_LIST,
];

type ListElement = {} & ChiefElement;

const Ul = styled.ul`
  margin: 0;
  padding-inline-start: 25px;
  ul ul ul ul,
  ul {
    list-style: square outside none;
  }

  ul ul ul ul ul,
  ul ul {
    list-style: circle outside none;
  }

  ul ul ul ul ul ul,
  ul ul ul {
    list-style: disc outside none;
  }
`;
const Ol = styled.ol`
  margin: 0;
  padding-inline-start: 25px;
  ol ol ol ol,
  ol {
    list-style: decimal outside none;
  }
  ol ol ol ol ol,
  ol ol {
    list-style: lower-latin outside none;
  }
  ol ol ol ol ol ol,
  ol ol ol {
    list-style: lower-roman outside none;
  }
`;

const Li = styled.li``;

const _renderElement: InjectedRenderElement = {
  typeMatch: LIST_TYPES,
  renderElement: (props) => {
    switch (props.element.type) {
      case TYPE_UNORDERED_LIST:
        return renderElement(props, props.element.type, Ul);
      case TYPE_ORDERED_LIST:
        return renderElement(props, props.element.type, Ol);
      default:
        return renderElement(props, TYPE_LIST_ITEM, Li);
    }
  },
};

const Presenter: iPresenter = {
  element: _renderElement,
};

export function ListsAddon(props: AddonProps) {
  usePlugin({
    normalizeNode: (normalizeNode, editor) => ([node, path]) => {
      if (Element.isElement(node) && node.type === TYPE_LIST_ITEM) {
        const [parent] = Editor.parent(editor, path);
        if (
          parent &&
          Element.isElement(parent) &&
          ![TYPE_ORDERED_LIST, TYPE_UNORDERED_LIST].includes(
            parent.type as string
          )
        ) {
          Transforms.setNodes(editor, { type: "paragraph" }, { at: path });
          return;
        }
      }
      if (
        Element.isElement(node) &&
        [TYPE_ORDERED_LIST, TYPE_UNORDERED_LIST].includes(node.type)
      ) {
        for (const [child, childPath] of Node.children(editor, path)) {
          console.log(child);
          if (Element.isElement(child)) {
            if (child.type !== TYPE_LIST_ITEM) {
              Transforms.setNodes(
                editor,
                { type: TYPE_LIST_ITEM, children: [{ text: "" }] },
                { at: childPath }
              );
              return;
            } else {
              if (!child.children) {
                Transforms.setNodes(
                  editor,
                  { type: TYPE_LIST_ITEM, children: [{ text: "" }] },
                  { at: childPath }
                );
                return;
              }
            }
          }
        }
      }
      return normalizeNode([node, path]);
    },
  });

  useRenderElement<ListElement>(_renderElement);

  useOnKeyDown({
    pattern: "enter",
    handler: (e, editor) => {
      const { elementType, element } = getState(editor);
      if (elementType !== TYPE_LIST_ITEM) {
        return false;
      }
      let ancestor = getAncestor(editor, element as Element, 1);

      if (
        !ancestor ||
        (Element.isElement(ancestor) &&
          ![TYPE_ORDERED_LIST, TYPE_UNORDERED_LIST].includes(
            ancestor!.type as string
          ))
      ) {
        return false;
      }
      e.preventDefault();
      if (!isElementEmpty(editor)) {
        Editor.withoutNormalizing(editor, () => {
          Transforms.insertNodes(editor, {
            type: TYPE_LIST_ITEM,
            children: [{ text: "" }],
          });
        });
      } else {
        const active = getActiveNode(editor);
        if (!active) {
          return false;
        }
        const list = getAncestor(editor, active, 1) as Element;
        const listParent = getAncestor(editor, active, 2);

        if (
          listParent &&
          Element.isElementList(listParent.children) &&
          listParent.children[0].type === TYPE_LIST_ITEM
        ) {
          //2. If nested then unwrap and move left
          Transforms.unwrapNodes(editor, {
            match: (n) => Element.isElement(n) && n.type === list.type,
            split: true,
          });
        } else {
          //3. At top level so cannot unwrap, insert new paragraph and break from list
          toggleList(editor, list.type as string);
        }
      }

      return true;
    },
  });
  useOnKeyDown({
    pattern: "tab",
    handler: (e, editor) => {
      const { elementType, element } = getState(editor);
      if (!element || elementType !== TYPE_LIST_ITEM) {
        return false;
      }

      let ancestor = getAncestor(editor, element, 1);
      if (
        !ancestor ||
        (Element.isElement(ancestor) &&
          ![TYPE_ORDERED_LIST, TYPE_UNORDERED_LIST].includes(
            ancestor!.type as string
          ))
      ) {
        return false;
      }

      if (ancestor.children.length > 1) {
        e.preventDefault();
        const index = ancestor?.children.indexOf(element) - 1;
        if (ancestor.children[index].type !== TYPE_LIST_ITEM) {
          // 3a. tab = move right. If the node above is a list then append to it.
          const otherList = ancestor.children[index] as Element;
          const destination = ReactEditor.findPath(
            editor,
            otherList.children[otherList.children.length - 1]
          );
          destination[destination.length - 1]++;
          Transforms.moveNodes(editor, {
            to: destination,
          });
        } else {
          // 3b. otherwise, wrap the item in a new list and nest in parent
          Transforms.wrapNodes(editor, { type: ancestor.type, children: [] });
        }
        return true;
      }
      return false;
    },
  });
  useOnKeyDown({
    pattern: "shift+tab",
    handler: (e, editor) => {
      const { elementType, element } = getState(editor);
      if (!element || elementType !== TYPE_LIST_ITEM) {
        return false;
      }

      let ancestor = getAncestor(editor, element, 1);
      if (
        !ancestor ||
        ![TYPE_ORDERED_LIST, TYPE_UNORDERED_LIST].includes(
          ancestor!.type as string
        )
      ) {
        return false;
      }

      if (e.shiftKey) {
        let ancestor = getAncestor(editor, element, 2);
        // 1. tab+shift = move left to grandparent list if nested
        if (ancestor?.children.find((child) => child.type === TYPE_LIST_ITEM)) {
          Transforms.liftNodes(editor);
        } else {
          const options = {
            at: ReactEditor.findPath(editor, element),
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
    },
  });
  return null;
}

ListsAddon.Presenter = Presenter;
