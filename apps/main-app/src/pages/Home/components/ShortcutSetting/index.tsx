import { Modal, Row, Col, Typography, Divider, Message } from "@yisa/webui";
import type { ModalProps } from "@yisa/webui/es/Modal/interface";
import Menu, { DragType, MenuItemList, MenuItemProps } from "../Menu";
import "./index.scss";
import ConfigurableProvider from "../../ConfigurableProvider";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { ItemMenu } from "@/store/slices/user";
import { useEffect, useState } from "react";
import services from "@/services";

const ShortcutSetting: React.FC<
  ModalProps & {
    original: ItemMenu[];
  }
> = (props) => {
  const { onOk, original, ...rest } = props;
  /**
   * @description 拖拽时移动数据
   * @param from
   * @param to
   */

  const moveCard = (from: number, to: number) => {
    setShortcuts((previousShortcus) => {
      const newShortcuts = [...previousShortcus];
      const [removed] = newShortcuts.splice(from, 1);
      if (!removed) return previousShortcus;
      newShortcuts.splice(to, 0, removed);
      return newShortcuts;
    });
  };
  /**
   * @description 点击删除时处理
   */
  const handleRemove: MenuItemProps["onBadgeClick"] = (item, type) => {
    if (type == "check") return;
    setShortcuts((previous) => {
      const filtered = previous.filter((s) => s.path !== item.path);
      return [
        ...filtered,
        {
          icon: "",
          text: "待添加",
          path: "placeholder" + Math.random(),
          name: "placeholder",
          className: "shortcut-setting-placeholder",
          draggable: false,
          droppable: false,
        },
      ];
    });
  };

  /**
   * 处理从左边拖拽到右边
   */
  const handleDrop = (item: ItemMenu) => {
    // 没有多余位置了
    if (!droppable) return;
    // 已经存在
    if (shortcuts.find((i) => i.path === item.path)) return;
    setShortcuts((previous) => {
      const newShortcuts = [...previous];
      const insertIndex = previous.findIndex((i) => i.name === "placeholder");
      // 插入第一placeholer所在位置
      newShortcuts.splice(insertIndex, 0, {
        text: item.text,
        name: item.name,
        path: item.path,
        icon: item.icon,
        draggable: true,
        droppable: true,
        sortValue: 0,
        badge: "remove",
        dragType: DragType.Shortcut,
        moveCard,
        onBadgeClick: handleRemove,
      });
      // 弹出最后一个placeholder
      newShortcuts.pop();
      return newShortcuts;
    });
  };
  const handleOk = () => {
    services.homepage
      .updateShortcuts<any, any>({
        commonApps: shortcuts
          .filter((s) => s.name !== "placeholder")
          .map((s) => s.name),
      })
      .then(() => {
        onOk?.();
        Message.success("更新成功");
      })
      .catch(() => {
        Message.success("更新失败");
      });
  };

  // placeholders: 占位
  const placeholders = Array.from({
    length: 8 - original.length,
  }).map((_, idx) => {
    return {
      icon: "",
      text: "待添加",
      path: "placeholder" + idx,
      name: "placeholder",
      className: "shortcut-setting-placeholder",
      draggable: false,
      droppable: false,
    };
  });

  // 一共8个
  const [shortcuts, setShortcuts] = useState([
    ...original.map((item) => ({
      ...item,
      draggable: true,
      droppable: true,
      sortValue: 0,
      badge: "remove",
      dragType: DragType.Shortcut,
      moveCard,
      onBadgeClick: handleRemove,
    })),
    ...placeholders,
  ]);

  const droppable = shortcuts.some((item) => {
    if (!item) {
      debugger;
      return false;
    }
    return item.name === "placeholder";
  });

  const handleMenuItemClick = (item: ItemMenu, badge: MenuItemProps["badge"]) => {
    handleDrop(item)
  }

  return (
    <ConfigurableProvider
      configurable
      handleDrop={handleDrop}
      shortcuts={shortcuts}
    >
      <Modal
        title="我的常用功能"
        width={"1200px"}
        className="shortcut-setting"
        {...rest}
        onOk={handleOk}
      >
        <Row style={{ height: "97%", margin: "0", gap: "10px" }}>
          <Col span={12} className="shortcut-setting-col">
            <h3>全部功能</h3>
            <Divider style={{ margin: "10px 0" }} />
            <div className="shortcut-setting-area">
              <Menu
                onClick={handleMenuItemClick}
              />
            </div>
          </Col>
          <Col span={12} className="shortcut-setting-col">
            <h3 className="shortcut-setting__header">
              我的常用功能
              <p>按住拖动调整顺序</p>
            </h3>
            <Divider style={{ margin: "10px 0" }} />
            <div className="shortcut-setting-area">
              <Menu.MenuItemList
                items={shortcuts as any}
                droppable={droppable}
              />
            </div>
          </Col>
        </Row>
        <Divider style={{ margin: "10px 0" }} />
      </Modal>
    </ConfigurableProvider>
  );
};

export default ShortcutSetting;
