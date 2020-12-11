import React from "react";
import { ReactEditor } from "slate-react";
import { ElementTypeMatch } from "../chief";

export interface Control<T = React.FunctionComponent> {
  typeMatch?: ElementTypeMatch;
  render?: React.ReactNode | ((editor: ReactEditor) => React.ReactNode);
  Component?: T;
  category?: string;
}
