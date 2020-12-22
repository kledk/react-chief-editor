import { ReactEditor } from "slate-react";

export type KeyHandler = {
  /** Key pattern used to trigger, eg. "mod+b"*/
  pattern?: string | null | string[];
  /** Handler function for key trigger.*/
  handler: (
    e: KeyboardEvent,
    editor: ReactEditor
  ) => boolean | undefined | void;
  priority?: "high" | "low";
};
