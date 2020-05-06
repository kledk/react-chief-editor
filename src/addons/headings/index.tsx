import React from "react";
import { Addon } from "../../addon";
import { Heading } from "./Heading";
import { Transforms, Editor } from "slate";
import { ReactEditor } from "slate-react";
import { HeadingBtn } from "../../aeditor";

export const headingTypes = [
  "heading-1",
  "heading-2",
  "heading-3",
  "heading-4",
  "heading-5",
  "heading-6"
];

export const HeadingsAddon: Addon = {
  element: {
    typeMatch: /heading-[1-6]/,
    renderElement: props => {
      return <Heading {...props} />;
    }
  },
  onKeyDown: (event, editor) => {
    if (event.keyCode === 13) {
      const { selection } = editor;
      if (selection && selection.focus.offset !== 0) {
        const [match] = Editor.nodes(editor, {
          match: n => n.type?.match(/(heading)/)
        });
        if (match) {
          event.preventDefault();
          Transforms.insertNodes(editor, {
            type: "paragraph",
            children: [{ text: "" }]
          });
          return true;
        }
      }
    }
    return false;
  },
  contextMenu: {
    order: 4,
    category: "heading",
    renderButton: () => {
      return (
        <React.Fragment>
          <HeadingBtn headingType="heading-1">H1</HeadingBtn>
          <HeadingBtn headingType="heading-2">H2</HeadingBtn>
          <HeadingBtn headingType="heading-3">H3</HeadingBtn>
          <HeadingBtn headingType="heading-4">H4</HeadingBtn>
          <HeadingBtn headingType="heading-5">H5</HeadingBtn>
        </React.Fragment>
      );
    }
  }
};
