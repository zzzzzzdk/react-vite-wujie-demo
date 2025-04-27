import React from "react";
import classnames from "classnames";
import "./index.scss";
type InfoCellProps = {
  title: string;
  text?: string | number;
  customText?: React.ReactNode;
};
function InfoCell(props: InfoCellProps) {
  const { title, text, customText } = props;
  return (
    <div className="deployment-info-cell">
      <span className="name">{title}</span>
      {customText ? (
        customText
      ) : (
        <span className="text" title={text?.toString()}>
          <span>{text ? text : "-"}</span>
        </span>
      )}
    </div>
  );
}

type InfoCellListProps = {
  className?: string;
  cells: InfoCellProps[];
};
function InfoCellList(props: InfoCellListProps) {
  const { cells } = props;
  return (
    <div className={classnames("deployment-info-cell-list", props.className)}>
      {cells.map((cell, idx) => (
        <InfoCell key={idx} {...cell} />
      ))}
    </div>
  );
}
export default InfoCellList;
