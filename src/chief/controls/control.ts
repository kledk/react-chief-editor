import React from "react";
import { Editor } from "slate";
import { ElementTypeMatch } from "../chief";

export interface Control<T = React.FunctionComponent> {
  typeMatch?: ElementTypeMatch;
  render?: React.ReactNode | ((editor: Editor) => React.ReactNode);
  Component?: T;
  category?: string;
}
