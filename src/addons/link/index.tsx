import React from "react";
import { RenderElementProps } from "slate-react";
import { Element, Editor, Transforms, Range } from "slate";
import { Addon } from "../../addon";
import isUrl from "is-url";
import { LinkBtn } from "../../aeditor";

export const isLinkELement = (element: Element) => {
  return element.type === "link" && typeof element.url === "string";
};

export const Link = (props: RenderElementProps) => {
  return (
    <a {...props.attributes} href={props.element.url}>
      {props.children}
    </a>
  );
};

export const LinkAddon: Addon = {
  name: "link",
  element: {
    typeMatch: /link/,
    renderElement: props => {
      return <Link {...props} />;
    }
  },
  withPlugin: <T extends Editor>(editor: T): T => {
    const { insertData, insertText, isInline } = editor;

    editor.isInline = element => {
      return isLinkELement(element) ? true : isInline(element);
    };

    editor.insertText = text => {
      if (text && isUrl(text)) {
        wrapLink(editor, text);
      } else {
        insertText(text);
      }
    };
    //@ts-ignore
    editor.insertData = data => {
      const text = data.getData("text/plain");

      if (text && isUrl(text)) {
        wrapLink(editor, text);
      } else {
        insertData(data);
      }
    };
    //@ts-ignore
    return editor;
  },
  contextMenu: {
    order: 5,
    category: "link",
    renderButton: () => {
      return <LinkBtn>Link</LinkBtn>;
    }
  }
};

export const insertLink = (editor: Editor, url: string) => {
  if (editor.selection) {
    wrapLink(editor, url);
  }
};

export const isLinkActive = (editor: Editor) => {
  const [link] = Editor.nodes(editor, { match: n => n.type === "link" });
  return !!link;
};

const unwrapLink = (editor: Editor) => {
  Transforms.unwrapNodes(editor, { match: n => n.type === "link" });
};

const wrapLink = (editor: Editor, url: string) => {
  if (isLinkActive(editor)) {
    unwrapLink(editor);
  }

  const { selection } = editor;
  const isCollapsed = selection && Range.isCollapsed(selection);
  const link = {
    type: "link",
    url,
    children: isCollapsed ? [{ text: url }] : []
  };

  if (isCollapsed) {
    Transforms.insertNodes(editor, link);
  } else {
    Transforms.wrapNodes(editor, link, { split: true });
    Transforms.collapse(editor, { edge: "end" });
  }
};
