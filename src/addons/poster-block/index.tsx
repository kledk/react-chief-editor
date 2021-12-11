import { useDropdownMenu } from "react-overlays";
import { useFocused, useSelected } from "slate-react";
import { ToolbarBtn, ToolsWrapper } from "../..";
import {
  ChiefElement,
  ChiefRenderElementProps,
  iPresenter,
  usePlugin,
  useRenderElement,
} from "../../chief";
import { registerVoidType } from "../../chief/utils/register-void";
import { useShowOnFocus } from "../../chief/utils/use-show-on-focus";
import { Show } from "../../show";
import {
  StyledFocusToolbar,
  StyledFocusToolBtn,
} from "../../ui/StyledFocusToolbar";
import { WithAttentionToolbar } from "../../ui/WithAttentionToolbar";

export type PosterBlockElement = {
  type: "poster-block";
  backgroundImage?: string;
  backgroundColor?: string;
  flex: number;
  void: boolean;
} & ChiefElement;

function isPosterBlockElement(element: unknown): element is PosterBlockElement {
  if (element && (element as ChiefElement).type === "poster-block") {
    return true;
  }
  return false;
}

function PosterBlock(props: ChiefRenderElementProps<PosterBlockElement>) {
  const { children, ...renderElementProps } = props;
  const { element, attributes } = renderElementProps;
  const [showOnProps, ShouldShow] = useShowOnFocus(element, {
    isInside: true,
    isFocusedWithin: true,
  });

  const selected = useSelected();

  return (
    <div
      {...attributes}
      {...showOnProps}
      style={{
        display: "flex",
        flex: element.flex,
        flexBasis: props.element.void ? `${props.element.flex * 100}%` : "100%",
        flexDirection: "column",
        backgroundColor: element.backgroundColor,
        backgroundImage: element.backgroundImage,
        backgroundSize: "cover",
        cursor: props.element.void ? "default" : undefined,
        backgroundPosition: "center",
      }}
    >
      <ShouldShow style={{ right: 0 }}>
        <>
          <StyledFocusToolBtn onMouseDown={() => null}>
            Color
          </StyledFocusToolBtn>
        </>
      </ShouldShow>
      <div
        style={{
          width: "100%",
          height: "100%",
          ...(selected && props.element.void
            ? {
                border: "1px solid #d7ae84",
                backgroundColor: "rgba(255,255,255,0.1)",
              }
            : undefined),
        }}
      >
        {children}
      </div>
    </div>
  );
}

export function PosterBlockAddon() {
  useRenderElement<PosterBlockElement>({
    typeMatch: "poster-block",
    Component: (props) => <PosterBlock {...props} />,
  });
  usePlugin({
    isVoid: registerVoidType<PosterBlockElement>((element) => element.void),
  });
  return null;
}

const Presenter: iPresenter<PosterBlockElement> = {
  element: {
    typeMatch: "poster-block",
    renderElement: (props) => (
      <div
        style={{
          display: "flex",
          flex: props.element.flex,
          flexBasis: props.element.void
            ? `${props.element.flex * 100}%`
            : "100%",
          flexDirection: "column",
          backgroundColor: props.element.backgroundColor,
          backgroundImage: props.element.backgroundImage,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {props.children}
      </div>
    ),
  },
};

PosterBlockAddon.Presenter = Presenter;
