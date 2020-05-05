import { Addon } from "../../addon";
import { renderLeaf } from "../../leaf-renderer";

export const BoldAddon: Addon = {
  name: "boldaddon",
  renderLeaf(props) {
    return renderLeaf(props, "bold", "strong");
  }
};
