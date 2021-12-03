import { ChiefElement, useRenderElement } from "../../chief";

export type PosterBlockElement = {
  type: "poster-block";
  imageUrl?: string;
  backgroundColor?: string;
  flex: number;
} & ChiefElement;

function isPosterBlockElement(element: unknown): element is PosterBlockElement {
  if (element && (element as ChiefElement).type === "poster-block") {
    return true;
  }
  return false;
}

export function PosterBlockAddon() {
  useRenderElement<PosterBlockElement>({
    typeMatch: "poster-block",
    renderElement: (props) => {
      const { attributes, children, element } = props;
      return (
        <div
          style={{
            display: "flex",
            flex: element.flex,
            flexDirection: "column",
            backgroundColor: element.backgroundColor,
          }}
          {...attributes}
        >
          {children}
        </div>
      );
    },
  });
  return null;
}
