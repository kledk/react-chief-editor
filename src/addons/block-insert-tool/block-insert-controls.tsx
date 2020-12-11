import React, { ReactNode } from "react";
import groupBy from "lodash/groupBy";
import { useSlate } from "slate-react";
import { ToolDivider } from "../../ToolDivider";

import { useProvidedControls } from "../../chief/controls";

export function BlockInsertControls() {
  const editor = useSlate();
  const { controls } = useProvidedControls();
  if (controls.length > 0) {
    const groupedControls = groupBy(controls, "category");
    return (
      <React.Fragment>
        {Object.entries(groupedControls).map(([type, groupedControls], i) => (
          <React.Fragment key={`${type}${i}`}>
            {groupedControls.map((control, ii) => {
              if (control.Component) {
                return <control.Component key={`${type}${i}${ii}`} />;
              }
              const renderControl = control.render;
              return (
                <React.Fragment key={`${type}${i}${ii}`}>
                  {typeof renderControl === "function"
                    ? renderControl(editor)
                    : renderControl}
                </React.Fragment>
              );
            })}
            <ToolDivider />
          </React.Fragment>
        ))}
      </React.Fragment>
    );
  }
  return null;
}
