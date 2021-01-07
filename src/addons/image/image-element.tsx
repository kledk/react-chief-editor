import React, { useState, useCallback, useEffect } from "react";
import { Editor, Transforms } from "slate";
import { useFocused, useSelected, ReactEditor, useSlate } from "slate-react";
import { WithAttentionToolbar } from "../../ui/WithAttentionToolbar";
import { Input, InputWrapper } from "../../InputWrapper";
import isUrl from "is-url";
import { ImageElement } from "./index";
import { Button } from "../../ui/button";
import styled from "styled-components";
import { ToolBtnPopup } from "../../ToolBtnPopup";
import { StyledToolBox } from "../../ui/StyledToolBox";
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
      <div
        style={{
          width: "auto",
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
              resize: readOnly ? "none" : "vertical",
              overflow: "hidden",
              width: "auto",
              height: element.height,
              cursor: "pointer"
            }}
          >
            <WithAttentionToolbar
              {...renderElementProps}
              btns={
                <React.Fragment>
                  <StyledFocusToolBtn onMouseDown={toggleReplace}>
                    Replace
                  </StyledFocusToolBtn>
                  <ToolBtnPopup
                    renderContent={setShow => (
                      <StyledToolBox>
                        {/* <ToolbarBtn>Copy address</ToolbarBtn> */}
                        {/* <ToolbarBtn>Resize</ToolbarBtn> */}
                        <ToolbarBtn
                          onMouseDown={() => {
                            setShow(false);
                            align("left");
                          }}
                        >
                          Align left
                        </ToolbarBtn>
                        <ToolbarBtn
                          onMouseDown={() => {
                            setShow(false);
                            align("center");
                          }}
                        >
                          Align center
                        </ToolbarBtn>
                        <ToolbarBtn
                          onMouseDown={() => {
                            setShow(false);
                            align("right");
                          }}
                        >
                          Align right
                        </ToolbarBtn>
                        <ToolbarBtn
                          style={{ color: "#FE292D" }}
                          onMouseDown={handleDelete}
                        >
                          Delete
                        </ToolbarBtn>
                      </StyledToolBox>
                    )}
                    renderToolBtn={tprops => (
                      <StyledFocusToolBtn {...tprops}>
                        <span style={{}}>⚙︎</span>
                      </StyledFocusToolBtn>
                    )}
                  ></ToolBtnPopup>
                </React.Fragment>
              }
            >
              <img
                // draggable={false}
                style={{
                  filter: focused && selected ? "brightness(0.5)" : "none",
                  objectFit: "fill",
                  height: element.height,
                  display: "block"
                }}
                alt={element.caption}
                src={src}
              />
            </WithAttentionToolbar>
          </div>
        </ReactResizeDetector>
        {children}
      </div>
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
    <div {...attributes} contentEditable={false}>
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
