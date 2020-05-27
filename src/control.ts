import React from "react";
import { ReactEditor } from "slate-react";
import { ElementTypeMatch } from "./chief/chief";

export interface Control {
  typeMatch?: ElementTypeMatch;
  render?: ((editor: ReactEditor) => React.ReactNode) | React.ReactNode;
  Component?: React.FunctionComponent;
  category?: string;
}
