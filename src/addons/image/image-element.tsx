import React, { useState, useCallback, useEffect } from "react";
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

export const ImageBlock = (
  props: ChiefRenderElementProps<ImageElement> & {
    onOpenFileRequest?: () => void;
    onRemoved?: (url: string | null) => void;
  }
) => {
  const focused = useFocused();
  const selected = useSelected();
  const editor = useSlate();
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
            url: embedUrl
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
                  <ToolbarBtn>Copy address</ToolbarBtn>
                  <ToolbarBtn>Resize</ToolbarBtn>
                  <ToolbarBtn onMouseDown={toggleReplace}>Replace</ToolbarBtn>
                </StyledToolBox>
              )}
              renderToolBtn={tprops => (
                <StyledFocusToolBtn {...tprops}>...</StyledFocusToolBtn>
              )}
            ></ToolBtnPopup>
          </React.Fragment>
        }
      >
        <div>
          <div contentEditable={false} onClick={handleClick}>
            <img
              style={{
                objectFit: "contain",
                width: "100%",
                display: "block"
              }}
              alt={element.caption}
              src={src}
            />
          </div>
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
