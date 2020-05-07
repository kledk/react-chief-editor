import styled from "styled-components";

export const PlaceholderHint = styled.span<{
    isEmpty: boolean;
    placeholder?: string;
    hoverHint?: string;
}> `
  display: inline-block;
  width: 100%;
  ::before {
    content: "${props => props.isEmpty && props.placeholder && props.placeholder.length > 0
        ? props.placeholder
        : ``}"
;
    pointer-events: none;
    user-select: none;
    position: absolute;
    color: rgba(55, 53, 47, 0.2);
    ${props => props.theme.preferDarkOption &&
        `
@media (prefers-color-scheme: dark) {
    color: rgba(255, 255, 255, 0.36);
  }`}
  }
  &:hover:before {
    content: "${props => props.isEmpty && props.hoverHint && !props.placeholder
        ? props.hoverHint
        : props.isEmpty && props.placeholder
            ? props.placeholder
            : ""}";
  }
`;
