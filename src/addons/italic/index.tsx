import { Addon } from "../../addon";
import { renderLeaf } from "../../leaf-renderer";

export const ItalicAddon: Addon = {
  renderLeaf(props) {
    return renderLeaf(props, "italic", "em");
  }
};
