import { Addon } from "../../addon";
import { renderLeaf } from "../../leaf-renderer";

export const StrikethroughAddon: Addon = {
  renderLeaf(props) {
    return renderLeaf(props, "strikethrough", "s");
  }
};
