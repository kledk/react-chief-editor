import { NodeEntry, Range } from "slate";
import { ReactEditor } from "slate-react";
import { InjectedDecorator } from "../chief";
// TODO
export const handleDecorate = (
  entry: NodeEntry,
  editor: ReactEditor,
  decorators: InjectedDecorator[]
) => {
  let ranges: Range[] = [];
  for (let decorate of decorators) {
    const result = decorate.decorator(entry, editor);
    if (result) {
      return (ranges = ranges.concat(result));
    }
  }
  return ranges;
};
