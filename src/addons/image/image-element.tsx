import React, { useState, useCallback, useEffect, useRef } from "react";
import { Transforms } from "slate";
import {
  useFocused,
  useSelected,
  RenderElementProps,
  ReactEditor,
  useSlate
} from "slate-react";
import { ButtonBase } from "../../ui/button-base";
import { WithAttentionToolbar } from "../../ui/WithAttentionToolbar";
import { Input, InputWrapper } from "../../InputWrapper";
import isUrl from "is-url";
import { isImageElement, ImageElement } from "./index";
import { Button } from "../../ui/button";
import styled from "styled-components";
import { ToolBtnPopup } from "../../ToolBtnPopup";
import { StyledToolBox } from "../../StyledToolBox";
import { ToolbarBtn } from "../../ToolbarBtn";
import { StyledFocusToolBtn } from "../../ui/StyledFocusToolbar";
import { ChiefRenderElementProps } from "../../chief/chief";
import { UiWrap } from "../../ui/ui-wrap";
import ReactResizeDetector from "react-resize-detector/lib/";
import { useChief } from "../../chief/hooks/use-chief";

export const ImageBlock = (
  props: ChiefRenderElementProps<ImageElement> & {
    onOpenFileRequest?: () => void;
    onRemoved?: (url: string | null) => void;
  }
) => {
  const focused = useFocused();
  const selected = useSelected();
  const editor = useSlate();
  const { readOnly } = useChief();
  const { onOpenFileRequest, onRemoved, ...renderElementProps } = props;
  const { element, children, attributes } = renderElementProps;

  const [embedUrl, setEmbedUrl] = useState(element.url || "");
  const [isReplacing, setIsReplacing] = useState(false);

  const handleSubmitEmbed = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (embedUrl.length > 0) {
        Transforms.setNodes(
          editor,
          {
            url: embedUrl,
            align: "center"
          },
          {
            at: ReactEditor.findPath(editor, element)
          }
        );
        if (isReplacing) {
          setIsReplacing(false);
        }
      }
    },
    [embedUrl, isReplacing]
  );

  useEffect(() => {
    if (element.url && isReplacing) {
      setIsReplacing(false);
    }
  }, [element.url]);

  const handleDelete = useCallback(() => {
    onRemoved && onRemoved(element.url);
    Transforms.delete(editor, { at: ReactEditor.findPath(editor, element) });
  }, [element]);

  const handleUpload = useCallback(() => {
    onOpenFileRequest && onOpenFileRequest();
  }, [onOpenFileRequest]);

  const handleResize = useCallback((w, h) => {
    Transforms.setNodes(
      editor,
      {
        width: w,
        height: h
      },
      {
        at: ReactEditor.findPath(editor, element)
      }
    );
  }, []);

  const align = useCallback((align: ImageElement["align"]) => {
    Transforms.setNodes(
      editor,
      {
        align
      },
      {
        at: ReactEditor.findPath(editor, element)
      }
    );
  }, []);

  const toggleReplace = useCallback(() => {
    setIsReplacing(!isReplacing);
  }, [isReplacing]);

  const handleClick = () => {
    Transforms.select(editor, ReactEditor.findPath(editor, element));
  };

  let imageHandler = null;

  if (!isReplacing && element.url) {
    const src = element.url || "";
    imageHandler = (
      <WithAttentionToolbar
        {...renderElementProps}
        btns={
          <React.Fragment>
            <StyledFocusToolBtn onMouseDown={handleDelete}>
              Delete
            </StyledFocusToolBtn>
            <ToolBtnPopup
              renderContent={() => (
                <StyledToolBox>
                  {/* <ToolbarBtn>Copy address</ToolbarBtn> */}
                  {/* <ToolbarBtn>Resize</ToolbarBtn> */}
                  <ToolbarBtn onMouseDown={toggleReplace}>Replace</ToolbarBtn>
                  <ToolbarBtn onMouseDown={() => align("left")}>
                    Align left
                  </ToolbarBtn>
                  <ToolbarBtn onMouseDown={() => align("center")}>
                    Align center
                  </ToolbarBtn>
                  <ToolbarBtn onMouseDown={() => align("right")}>
                    Align right
                  </ToolbarBtn>
                </StyledToolBox>
              )}
              renderToolBtn={tprops => (
                <StyledFocusToolBtn {...tprops}>...</StyledFocusToolBtn>
              )}
            ></ToolBtnPopup>
          </React.Fragment>
        }
      >
        <div
          style={{
            position: "relative",
            height: element.height,
            display: "flex",
            justifyContent:
              props.element.align === "center"
                ? "center"
                : props.element.align === "left"
                ? "flex-start"
                : "flex-end"
          }}
          contentEditable={false}
          onClick={handleClick}
        >
          <ReactResizeDetector
            onResize={(w: number, h: number) => handleResize(w, h)}
          >
            <div
              style={{
                resize: readOnly ? "none" : "both",
                overflow: "auto",
                width: element.width,
                height: element.height
              }}
            >
              <img
                draggable={false}
                style={{
                  objectFit: "fill",
                  width: "100%",
                  height: "100%",
                  display: "block"
                }}
                alt={element.caption}
                src={src}
              />
            </div>
          </ReactResizeDetector>
        </div>
        {children}
      </WithAttentionToolbar>
    );
  } else {
    imageHandler = (
      <WithAttentionToolbar
        {...renderElementProps}
        btns={
          <React.Fragment>
            <StyledFocusToolBtn onMouseDown={handleDelete}>
              Delete
            </StyledFocusToolBtn>
            {isReplacing && (
              <StyledFocusToolBtn onMouseDown={toggleReplace}>
                Cancel
              </StyledFocusToolBtn>
            )}
          </React.Fragment>
        }
      >
        <div contentEditable={false}>
          <StyledImageEmptyContainer>
            <h2>Insert image</h2>
            <Button onMouseDown={handleUpload}>Upload</Button>
            <p>Or paste a link</p>
            <form onSubmit={handleSubmitEmbed} data-slate-editor>
              <InputWrapper style={{ width: "50%" }}>
                <Input
                  value={embedUrl}
                  onChange={e => setEmbedUrl(e.target.value)}
                  placeholder="Paste link"
                ></Input>
              </InputWrapper>
              <br />
              <Button disabled={embedUrl.length === 0 || !isUrl(embedUrl)}>
                Embed
              </Button>
            </form>
            {children}
          </StyledImageEmptyContainer>
        </div>
      </WithAttentionToolbar>
    );
  }

  return (
    <div
      style={{
        outline: focused && selected ? "1px solid rgb(46, 170, 220)" : "none"
      }}
      {...attributes}
      contentEditable={false}
    >
      {imageHandler}
    </div>
  );
};

export const StyledImageEmptyContainer = styled(UiWrap)`
  background-color: ${props => props.theme.colors.gray[300]};
  padding: 8px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  form {
    width: 70%;
    display: flex;
    flex: 1;
    justify-content: center;
    align-items: center;
  }
  h2,
  p {
    color: ${props => props.theme.colors.gray[600]};
    user-select: none;
  }
`;
