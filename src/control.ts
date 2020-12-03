import React from "react";
import { ReactEditor } from "slate-react";
import { ElementTypeMatch } from "./chief/chief";

export interface Control<T = React.FunctionComponent> {
  typeMatch?: ElementTypeMatch;
  render?: ((editor: ReactEditor) => React.ReactNode) | React.ReactNode;
  Component?: T;
  category?: string;
}
