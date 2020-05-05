import { Addon } from "../../addon";
import { renderLeaf } from "../../leaf-renderer";

export const UnderlineAddon: Addon = {
  renderLeaf(props) {
    return renderLeaf(props, "underline", "u");
  }
};
