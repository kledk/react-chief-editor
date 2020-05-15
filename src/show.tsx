import React, { Fragment, ReactNode } from "react";

export const Show = (props: {
  when: any | undefined | null;
  children: ReactNode;
}) => {
  const { when, children } = props;
  if (!Boolean(when)) {
    return null;
  }
  return <Fragment>{children}</Fragment>;
};
