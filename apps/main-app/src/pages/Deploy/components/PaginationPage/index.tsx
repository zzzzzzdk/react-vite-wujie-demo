import React from "react";
import { Pagination, Button, Divider } from "@yisa/webui";
import { Export, ResultHeader } from "@/components";
import { ResultBox } from "@yisa/webui_business";
import classnames from "classnames";
import type { PaginationProps } from "@yisa/webui/es/Pagination/interface";

import "./index.scss";

const prefixCls = "pagination-layout";
export interface PaginationLayoutProps {
  classname?: string;
  header?: React.ReactNode;
  main?: React.ReactNode;
  footer?: React.ReactNode;
  paginationProps?: PaginationProps;
  showFooter?: boolean;
}
export default function PaginationLayout(props: PaginationLayoutProps) {
  const {
    classname = "",
    header,
    main,
    footer,
    paginationProps,
    showFooter = true,
  } = props;
  return (
    <section className={classnames(prefixCls, classname)}>
      <div className="scroll-area">
        {header}
        <Divider style={{ margin: "20px 0" }} />
        {main}
        {/* <main>{main}</main> */}
      </div>

      {showFooter && (
        <footer>
          <div>{footer}</div>
          <Pagination {...paginationProps} />
        </footer>
      )}
    </section>
  );
}
