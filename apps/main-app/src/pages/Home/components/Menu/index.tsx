import { Icon, CheckOutlined, MinusOutlined } from "@yisa/webui/es/Icon";
import "./index.scss";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { ItemMenu } from "@/store/slices/user";
import Card from "../Card";
import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import classnames from "classnames";
import { useConfigurable } from "../../ConfigurableProvider";
import { useDrag, useDrop } from "react-dnd";
import type { Identifier, XYCoord } from "dnd-core";
import Color from "./color";
import { sample } from "lodash";
import { useHover } from "ahooks";
export type MenuItemProps = {
  item: ItemMenu;
  style?: React.CSSProperties;
  className?: string;
  /**
   * @description 右上角图标
   */
  badge?: "remove" | "check";
  index?: number;
  draggable?: boolean;
  droppable?: boolean;
  dragType?: DragType;
  moveCard?: (from: number, to: number) => void;
  onClick?: (item: ItemMenu, badge: MenuItemProps["badge"]) => void;
  onBadgeClick?: (item: ItemMenu, badge: "remove" | "check") => void;
};

export enum DragType {
  Shortcut = "Shortcut.MenuItem",
  Menu = "Menu.MenuItem",
  None = "_DO_NOT_USE",
}
interface DragItem {
  index: number;
  id: string;
  type: DragType;
  // 拖动的是menu(左侧)还是shortcut中的menuItem
}
export const MenuItem: React.FC<MenuItemProps> = (props) => {
  const {
    item,
    style,
    className,
    badge,
    index,
    draggable = false,
    droppable = false,
    dragType = DragType.None,
    moveCard,
    onClick,
    onBadgeClick,
  } = props;

  const { configurable, handleDrop } = useConfigurable();
  const navigate = useNavigate();

  const testUrl = (url: string) => {
    return /^https?:/.test(url)
  }

  const handleClick: React.EventHandler<React.MouseEvent> = (e) => {
    e.stopPropagation();
    // if (configurable) {
    //   return;
    // }
    //大图弹窗图标右边点击不能跳转链接
    if (badge === "remove") {
      return
    }
    // 占位符点击无效
    if (item.name === 'placeholder') {
      return
    }
    if (onClick) {
      onClick(item, badge);
      return;
    }
    if (testUrl(item.path)) {
      window.open(item.path);
    } else {
      window.open(`#${item.path}`);
    }
  };
  const handleBadgeClick: React.MouseEventHandler = (e) => {
    e.stopPropagation();
    onBadgeClick?.(item, badge!);
  };

  const ref = useRef<HTMLDivElement>(null);
  const [{ isDragging }, drag] = useDrag({
    type: dragType,
    item: () => {
      return { type: DragType, index: index, id: item.path, ...item };
    },
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult<DragItem>();
      if (item && dropResult && dragType === DragType.Menu) {
        console.log(item, dropResult);
        handleDrop?.(item);
      }
    },
  });

  const [{ handlerId }, drop] = useDrop<
    DragItem,
    void,
    { handlerId: Identifier | null }
  >({
    accept: DragType.Shortcut,
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item: DragItem, monitor) {
      // debugger;
      if (!ref.current) {
        return;
      }
      if (!moveCard) return;
      const dragIndex = item.index;
      const hoverIndex = index!;

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect();

      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      // Determine mouse position
      const clientOffset = monitor.getClientOffset();
      // Get pixels to the top
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;

      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%

      // Dragging downwards
      // if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) { return;
      // }

      // // Dragging upwards
      // if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
      //   return;
      // }

      // Time to actually perform the action
      moveCard(dragIndex, hoverIndex);
      // Note: we're mutating the monitor item here!  // Generally it's better to avoid mutations, // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
    },
  });
  if (draggable) {
    drag(ref);
  }
  if (droppable) {
    drop(ref);
  }
  const isHovering = useHover(ref);
  return (
    <div
      ref={ref}
      className={classnames("homepage-menu-item", className, {
        "homepage-menu-item--dragging": isDragging,
      })}
      style={style}
      onClick={handleClick}
      data-handler-id={handlerId}
    >
      <div
        className={classnames("homepage-menu-item-icon", {
          "do-not-transition": configurable,
        })}
        style={{
          // background: sample(ColorPicker),
          background: Color[String(item.name).toLowerCase()],
        }}
      >
        <Icon type={item.icon ?? "xingming"} />
      </div>
      <span className="homepage-menu-item-name">{item.text}</span>
      {badge && (
        <div className="homepage-menu-item-badge" onClick={handleBadgeClick}>
          {isHovering && badge === "remove" && <Icon type="jianhao" />}
          {badge === "check" && <Icon type="duihao" />}
        </div>
      )}
    </div>
  );
};

type MenuItemListProps = {
  items?: (ItemMenu & Omit<MenuItemProps, "item">)[];
  droppable?: boolean;
  itemType?: DragType;
  itemDraggable?: boolean;
  itemBadge?: "remove" | "check";
  onClick?: (item: ItemMenu, badge: MenuItemProps["badge"],) => void;
};
export const MenuItemList: React.FC<
  React.PropsWithChildren<MenuItemListProps>
> = (props) => {
  const {
    children,
    items = [],
    droppable = false,
    itemType = DragType.None,
    itemDraggable = false,
    itemBadge,
    onClick,
  } = props;

  const [{ canDrop }, drop] = useDrop({
    accept: DragType.Menu,
    drop() {
      return { name: "Menu.MenuList" };
    },
    collect(monitor) {
      return {
        canDrop: monitor.canDrop(),
      };
    },
  });
  const ref = useRef<HTMLDivElement>(null);
  if (droppable) {
    drop(ref);
  }

  const { configurable, shortcuts } = useConfigurable();
  // const handleClick = (item: ItemMenu, badge: MenuItemProps["badge"]) => {
  //   if (!badge) {
  //     console.log(item)
  //   }
  // }

  return (
    <div
      className="homepage-menu-item-list"
      ref={ref}
      style={
        {
          // background: canDrop && droppable ? "red" : "none",
        }
      }
    >
      {items.map((item, idx) => {
        return (
          <MenuItem
            key={item.path}
            index={idx}
            draggable={itemDraggable}
            item={item}
            dragType={itemType}
            badge={
              shortcuts?.some((i) => i.path === item.path)
                ? itemBadge
                : undefined
            }
            {...item}
            onClick={onClick}
          />
        );
      })}
      {children}
    </div>
  );
};
const Menu = ({ onClick }: Pick<MenuItemProps, "onClick">) => {
  /* 菜单列表 */
  const menus = useSelector<RootState, ItemMenu[]>((state) => {
    return state.user.menu;
  });
  const { configurable } = useConfigurable();
  return (
    <Card header={null} className="homepage-menu">
      {menus.map((item) => {
        return (
          <Card
            arrorwIcon
            iconfont={item.icon}
            key={item.path}
            title={item.text}
            style={{
              overflow: "visible",
              border: "none",
              borderRadius: "none",
              boxShadow: "none",
              padding: "0",
            }}
            bodyStyle={{
              overflow: "visible",
            }}
          >
            {item.children ? (
              <MenuItemList
                itemBadge={configurable ? "check" : undefined}
                itemType={configurable ? DragType.Menu : DragType.None}
                items={item.children}
                itemDraggable={configurable}
                onClick={onClick}
              />
            ) : (
              <MenuItemList
                itemBadge={configurable ? "check" : undefined}
                itemDraggable={configurable}
                itemType={configurable ? DragType.Menu : DragType.None}
                items={[item]}
                onClick={onClick}
              />
            )}
          </Card>
        );
      })}
    </Card>
  );
};
MenuItemList.displayName = "Menu.MenuItemList";
Menu.MenuItemList = MenuItemList;
MenuItem.displayName = "Menu.MenuItem";
Menu.MenuItem = MenuItem;
export default Menu;
