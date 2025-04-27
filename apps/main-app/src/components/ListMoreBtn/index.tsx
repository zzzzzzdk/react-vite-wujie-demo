import React, { useState } from "react";
import { Popover, Link, Button } from "@yisa/webui";
import { ResultRowType } from "@/pages/Search/Target/interface";
import { flatten, quickLinks } from "@/utils";
import { LinkType } from "@/components/Card/FooterLinks/interface";
import { ErrorSubmitModal, JoinClue } from "@/components";
import "./index.scss";

const ListMore = (props: { data: ResultRowType }) => {
  const { data } = props;
  //加入线索库
  const [showClue, setShowClue] = useState(false);
  //纠错
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [checkedList, setCheckedList] = useState<any[]>([]);

  const handleEleClick = (childElem: LinkType) => {
    if (childElem.link === "joinClue") {
      setShowClue(true);
      setCheckedList([data]);
    }

    if (childElem.link === "errorSubmit") {
      setErrorModalVisible(true);
      setCheckedList([data]);
    }
  };

  // 取消纠错
  const handleErrorModalCancel = () => {
    setErrorModalVisible(false);
  };
  // 提交纠错
  const errorSubmitPost = () => {
    setErrorModalVisible(false);
  };

  return (
    <Popover
      overlayClassName="opration-more"
      placement="bottom"
      // getPopupContainer={(trigger) => trigger.parentNode as HTMLElement}
      content={
        <ul>
          {flatten(quickLinks(data)).map((item, index) => {
            if (item.children) return "";
            return (
              <li className="opration-item" key={index}>
                {item.isClick ? (
                  <span
                    className={item.className}
                    onClick={() => handleEleClick(item)}
                  >
                    {item.text}
                  </span>
                ) : (
                  <Link
                    className={item.className}
                    href={item.link}
                    disabled={!item.link}
                    target="_blank"
                  >
                    {item.text || "--"}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      }
    >
      <Button size="mini">更多操作</Button>
      <JoinClue
        visible={showClue}
        clueDetails={checkedList}
        onOk={() => {
          setShowClue(false);
        }}
        onCancel={() => {
          setShowClue(false);
        }}
      />
      <ErrorSubmitModal
        carryData={checkedList[0]}
        modalVisible={errorModalVisible}
        onCancel={handleErrorModalCancel}
        onOk={errorSubmitPost}
      />
    </Popover>
  );
};

export default ListMore;
