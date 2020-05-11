import { css } from "styled-components";
export function OverrideTheme(
  name: string,
  props: {
    theme: {
      overrides?: {
        [key: string]: ReturnType<typeof css>;
      };
    };
  }
) {
  if (props.theme.overrides && props.theme.overrides[name]) {
    return props.theme.overrides[name];
  }
  return undefined;
}
