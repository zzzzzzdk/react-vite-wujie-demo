import { useState } from "react";
import "./index.scss";
import classnames from "classnames";
export default function Heading(props: {
  children: React.ReactNode;
  level?: 1 | 2;
  showBar?: boolean;
  round?: boolean;
  id?: string;
  gray?: boolean;
}) {
  const cls = "deployment-heading";
  const {
    id = "",
    level = 1,
    children,
    showBar = true,
    round = false,
    gray = false,
  } = props;
  return (
    <h1
      id={id}
      className={classnames(cls, `${cls}-level-${level}`, {
        [`${cls}-gray`]: gray,
      })}
    >
      {showBar && (
        <span className={classnames("blue-bar", { "blue-bar-round": round })} />
      )}

      <span className="text">{children}</span>
    </h1>
  );
}
