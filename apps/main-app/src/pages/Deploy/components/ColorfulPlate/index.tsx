import React from "react";
import classnames from "classnames";
import { PlateTypeId } from "@/components/FormPlate/interface";
import "./index.scss";
type ColorfulPlateProps = {
  plate?: string;
  color?: PlateTypeId;
  showTiTle?: boolean;
};
function ColorfulPlate(props: ColorfulPlateProps) {
  const { plate = "", color = -1, showTiTle = true } = props;
  const plateColorType = plate.length > 0 ? color : -1;
  const plateText = plate.length > 0 ? plate : "-";

  const handleClick: React.MouseEventHandler = (e) => {
    e.stopPropagation();
    if (!plate) return;
    const params = {
      licensePlate: plate,
      plateColorTypeId: color,
    };
    const queryStr = encodeURIComponent(JSON.stringify(params));
    window.open(`#/record-detail-vehicle/?${queryStr}`);
  };
  return (
    <div
      onClick={handleClick}
      className={classnames(
        "colorful-plate",
        "plate-bg",
        `plate-color-${plateColorType}`
      )}
      title={showTiTle ? "二次识别" : ""}
    >
      {plateText}
    </div>
  );
}

export default ColorfulPlate;
