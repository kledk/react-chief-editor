//@ts-nocheck
import { useEffect, useCallback, useState, useRef } from "react";
import {
  Editor,
  Point,
  Node,
  Transforms,
  Location,
  Element,
  Range,
} from "slate";
import { ReactEditor } from "slate-react";
import { ChiefEditor } from "./typings";

export const isInside = (rect: ClientRect, x: number, y: number) => {
  return (
    x >= rect.left &&
    x <= rect.left + rect.width &&
    y >= rect.top &&
    y <= rect.top + rect.height
  );
};

export const useGlobalHover = (element: HTMLElement | null) => {
  const [over, setOver] = useState(false);

  const handleMove = useCallback(
    (event: MouseEvent) => {
      if (element) {
        const bounds = element.getBoundingClientRect();
        setOver(isInside(bounds, event.clientX, event.clientY));
      }
    },
    [element]
  );

  useEffect(() => {
    window.addEventListener("mousemove", handleMove);
    return () => {
      window.removeEventListener("mousemove", handleMove);
    };
  }, [element]);
  return over;
};

export function useHover<T extends HTMLElement>() {
  const [value, setValue] = useState(false);

  const ref = useRef<T>(null);

  const handleMouseOver = () => setValue(true);
  const handleMouseOut = () => setValue(false);

  useEffect(
    () => {
      const node = ref.current;
      if (node) {
        node.addEventListener("mouseover", handleMouseOver);
        node.addEventListener("mouseout", handleMouseOut);

        return () => {
          node.removeEventListener("mouseover", handleMouseOver);
          node.removeEventListener("mouseout", handleMouseOut);
        };
      }
      return undefined;
    },
    [ref.current] // Recall only if ref changes
  );

  return [ref, value] as const;
}

export const getActiveNode = (editor: Editor) => {
  if (editor.selection) {
    const [, path] = Editor.node(editor, editor.selection);
    if (path.length) {
      const [parent] = Editor.parent(editor, path);
      return parent;
    }
  }
  return null;
};

export const getActiveNodeType = (editor: Editor) => {
  const block = getActiveNode(editor);
  return Element.isElement(block) ? block.type : null;
};

export const clone = (value: any) => {
  return JSON.parse(JSON.stringify(value));
};

interface State {
  node: Node | null;
  point: Point | null;
  selection: Range | null;
}

export const useLastFocused = (editor: ChiefEditor) => {
  const [state, setState] = useState<State>({
    node: null,
    point: null,
    selection: null,
  });
  const { selection } = editor;
  const current = getActiveNodeType(editor);

  useEffect(() => {
    if (!ReactEditor.isFocused(editor)) {
      return;
    }
    if (!selection) {
      return;
    }
    if (current) {
      const point = selection.focus;
      const [node] = Editor.parent(editor, point);
      if (Node.isNode(node)) {
        setState({ node, point, selection: clone(selection) });
      }
    }
  }, [current, selection]);

  return state;
};

export const isBlockEmpty = (editor: Editor, location?: Location) => {
  let selection: Location | null = editor.selection;
  if (location) {
    selection = location;
  }
  if (selection) {
    const [node] = Editor.node(editor, selection);
    return Node.string(node).length === 0;
  }

  return false;
};

export const toggleBlock = (editor: Editor, type: string) => {
  const isActive = isNodeActive(editor, type);

  Transforms.setNodes(editor, {
    type: isActive ? "paragraph" : type,
  });
};

export const isNodeActive = (editor: Editor, type: string) => {
  const { selection } = editor;
  if (!selection) {
    return false;
  }
  const [match] = Editor.nodes(editor, {
    at: selection,
    match: (n) => Element.isElement(n) && n.type === type,
  });
  return !!match;
};

export function useOnClickOutside(
  ref: React.RefObject<HTMLElement | null>,
  handler: (event: MouseEvent | TouchEvent) => void
) {
  useEffect(
    () => {
      const listener = (event: MouseEvent | TouchEvent) => {
        // Do nothing if clicking ref's element or descendent elements
        if (
          !ref.current ||
          (event.target &&
            ref.current.contains(event.target as globalThis.Node))
        ) {
          return;
        }

        handler(event);
      };

      document.addEventListener("mousedown", listener);
      document.addEventListener("touchstart", listener);

      return () => {
        document.removeEventListener("mousedown", listener);
        document.removeEventListener("touchstart", listener);
      };
    },
    // Add ref and handler to effect dependencies
    // It's worth noting that because passed in handler is a new ...
    // ... function on every render that will cause this effect ...
    // ... callback/cleanup to run every render. It's not a big deal ...
    // ... but to optimize you can wrap handler in useCallback before ...
    // ... passing it into this hook.
    [ref, handler]
  );
}

export function getNodeFromSelection(editor: Editor, selection: Range | null) {
  if (selection) {
    const [, path] = Editor.node(editor, selection);
    if (path.length) {
      const [parent] = Editor.parent(editor, path);
      return parent;
    }
  }
  return null;
}

export const findNodes = (editor: Editor, match: (node: Node) => boolean) => {
  return Editor.nodes(editor, {
    mode: "all",
    at: {
      anchor: Editor.start(editor, []),
      focus: Editor.end(editor, []),
    },
    match,
  });
};

export const getAncestor = (editor: Editor, node: Node, level = 1) => {
  let parent: Node | null = null;
  let count = 0;
  while (node && count !== level) {
    count++;
    try {
      const path = ReactEditor.findPath(editor, node);
      if (path.length === 0) {
        return null;
      }
      parent = Editor.parent(editor, path)[0];
      if (parent === editor) {
        return null;
      }
      node = parent;
    } catch (e) {}
  }
  return parent;
};
