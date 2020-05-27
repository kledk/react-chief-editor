import {
  NodeEntry,
  Range
} from "slate";
import { ReactEditor } from "slate-react";
// TODO
export const handleDecorate = (
  entry: NodeEntry,
  editor: ReactEditor,
  decorateList: Array<() => []>
) => {
  let ranges: Range[] = [];
  // for (let decorate of decorateList) {
  //   const result = decorate(entry, editor);
  //   if (result) {
  //     return (ranges = ranges.concat(result));
  //   }
  // }
  return ranges;
};
