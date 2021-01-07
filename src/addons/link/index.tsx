import React, { useEffect, useRef, useState, useCallback } from "react";
import { useSlate, useEditor } from "slate-react";
import { Element, Editor, Transforms, Range, Node } from "slate";
import { AddonProps } from "../../addon";
import isUrl from "is-url";
import { ToolBtnPopup } from "../../ToolBtnPopup";
import { useOnClickOutside } from "../../utils";
import { StyledToolBox } from "../../ui/StyledToolBox";
import { InputWrapper, Input } from "../../InputWrapper";
import { ToolbarBtn } from "../../ToolbarBtn";
import { useRenderElement } from "../../chief/hooks/use-render-element";
import { usePlugin } from "../../chief/hooks/use-plugin";
import { useLabels } from "../../chief/hooks/use-labels";
import { ChiefElement } from "../../chief";
import { shortcutText } from "../../shortcut";
import { iPresenter } from "../../chief/chief-presentation";
import { ElementHoverTip } from "../../element-hover-tip";
import { useSaveSelection } from "../../chief/utils/saved-selection";
import { ControlProps, useIsControlEligable } from "../../chief/controls";
import { registerInlineType } from "../../chief/utils/register-inline";

export const isLinkELement = (element: Element) => {
  return element.type === "link" && typeof element.url === "string";
};

export function LinkAddon(props: AddonProps) {
  useLabels(props.labels);
  usePlugin({
    insertText: (insertText, editor) => (text) => {
      if (text && isUrl(text)) {
        wrapLink(editor, text);
      } else {
        insertText(text);
      }
    },
    insertData: (insertData, editor) => (data) => {
      const text = data.getData("text/plain");
      if (text && isUrl(text)) {
        wrapLink(editor, text);
      } else {
        insertData(data);
      }
    },
    isInline: registerInlineType(isLinkELement),
  });

  useRenderElement<{ url: string } & ChiefElement>({
    typeMatch: "link",
    renderElement: (props) => (
      <ElementHoverTip
        delayed
        placement="bottom"
        tip={
          <span>
            <a rel="noreferrer" target="_blank" href={props.element.url}>
              {props.element.url}
            </a>
          </span>
        }
      >
        {(triggerRef) => (
          <a {...props.attributes} href={props.element.url}>
            <span ref={triggerRef}>{props.children}</span>
          </a>
        )}
      </ElementHoverTip>
    ),
  });
  return null;
}

export function LinkControl(props: ControlProps) {
  const editor = useEditor();
  const isActive = isLinkActive(editor);
  if (
    !useIsControlEligable({
      isText: true,
    })
  ) {
    return null;
  }
  return (
    <ToolBtnPopup
      shortcut="mod+k"
      renderContent={(setShow) => (
        <StyledToolBox>
          <LinkPopup onClose={() => setShow(false)} />
        </StyledToolBox>
      )}
      renderToolBtn={(tprops, show) => (
        <ToolbarBtn
          tooltip={{
            label: {
              key: "elements.link",
              defaultLabel: "Add link",
            },
            shortcut: shortcutText("mod+k"),
          }}
          {...tprops}
          isActive={isActive || show}
        >
          {props.children}
        </ToolbarBtn>
      )}
    />
  );
}

const Presenter: iPresenter<{ url: string } & ChiefElement> = {
  element: {
    typeMatch: "link",
    renderElement: (props) => <a href={props.element.url}>{props.children}</a>,
  },
};

LinkAddon.Presenter = Presenter;

export const insertLink = (editor: Editor, url: string) => {
  if (editor.selection) {
    wrapLink(editor, url);
  }
};

export const isLinkActive = (editor: Editor) => {
  const [link] = Editor.nodes(editor, { match: (n) => n.type === "link" });
  return Boolean(link);
};

const unwrapLink = (editor: Editor) => {
  Transforms.unwrapNodes(editor, { match: (n) => n.type === "link" });
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
    children: isCollapsed ? [{ text: url }] : [],
  };

  if (isCollapsed) {
    Transforms.insertNodes(editor, link);
  } else {
    Transforms.wrapNodes(editor, link, { split: true });
    Transforms.collapse(editor, { edge: "end" });
  }
};

function LinkPopup(props: { onClose: () => void }) {
  const editor = useSlate();
  const { selection } = editor;
  const { saveSelection } = useSaveSelection();
  useEffect(() => {
    return saveSelection(selection);
  }, []);
  const linkWrapperRef = useRef<HTMLFormElement>(null);
  useOnClickOutside(linkWrapperRef, () => {
    props.onClose();
  });
  let linkNode: Node | null = null;
  if (selection) {
    const [_linkNode] = Editor.nodes(editor, {
      at: selection,
      match: (n) => n.type === "link",
    });
    linkNode = _linkNode && _linkNode[0];
  }
  const [url, setUrl] = useState("");
  useEffect(() => {
    if (linkNode && typeof linkNode.url === "string") {
      setUrl(linkNode.url);
    }
  }, [linkNode]);
  const handleInsertLink = useCallback(() => {
    if (url.length > 0) {
      insertLink(editor, url);
      props.onClose();
    } else if (
      linkNode &&
      typeof linkNode.url === "string" &&
      linkNode.url.length > 0
    ) {
      unwrapLink(editor);
      props.onClose();
    }
  }, [url]);

  const handleUnlink = useCallback(() => {
    unwrapLink(editor);
    props.onClose();
  }, [url]);

  const [getLabel] = useLabels();

  return (
    <form ref={linkWrapperRef} onSubmit={handleInsertLink}>
      <div
        style={{
          padding: 9,
          display: "flex",
          minWidth: 400,
          flexDirection: "row",
        }}
      >
        <InputWrapper>
          <Input
            value={url}
            onChange={(e: React.FormEvent<HTMLInputElement>) =>
              setUrl(e.currentTarget.value)
            }
            placeholder={getLabel({
              key: "elements.link.placeholder",
              defaultLabel: "Paste or type your link here",
            })}
            autoFocus
          />
        </InputWrapper>
        <ToolbarBtn
          rounded
          disabled={url.length === 0}
          onMouseDown={handleInsertLink}
        >
          {getLabel({
            key: "elements.link.btn.link",
            defaultLabel: "Link",
          })}
        </ToolbarBtn>
        <ToolbarBtn
          rounded
          disabled={
            !isLinkActive(editor)
            // || (linkNode &&
            //   typeof linkNode.url === "string" &&
            //   linkNode.url.length > 0)
          }
          onMouseDown={handleUnlink}
        >
          {getLabel({
            key: "elements.link.btn.unlink",
            defaultLabel: "Unlink",
          })}
        </ToolbarBtn>
      </div>
    </form>
  );
}
