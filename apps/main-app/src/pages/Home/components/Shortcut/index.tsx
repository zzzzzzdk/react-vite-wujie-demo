import { useEffect, useState } from "react";
import Card from "../Card";
import ShortcutSetting from "../ShortcutSetting";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { ItemMenu } from "@/store/slices/user";
import Menu, { MenuItemProps } from "../Menu";
import { Loading } from "@yisa/webui";
import "./index.scss";
import services from "@/services";
type ShortcutProps = {};
const Shortcut: React.FC<ShortcutProps> = (props) => {
  const [showSetting, setShowSetting] = useState(false);

  const plusTrigger: MenuItemProps = {
    className: "shortcut-add",
    item: {
      text: "添加应用",
      name: "",
      path: "",
      icon: "jiahao",
    },
    onClick() {
      setShowSetting(true);
    },
  };

  const [shortcuts, setShortcuts] = useState<ItemMenu[]>([]);

  const showPlusTrigger = shortcuts.length < 8;
  const [loading, setLoading] = useState(true);
  const fetchShortcuts = () => {
    setLoading(true);
    services.homepage
      .getShortcuts()
      .then((res) => {
        if (!res.data) return;
        if (!Array.isArray(res.data)) return;
        setShortcuts(res.data);
      })
      .catch((e) => {
        console.error(e);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  useEffect(() => {
    fetchShortcuts();
  }, []);
  return (
    <>
      <ShortcutSetting
        mountOnEnter
        key={JSON.stringify(shortcuts)}
        original={shortcuts}
        visible={showSetting}
        onCancel={() => {
          setShowSetting(false);
        }}
        onOk={() => {
          setShowSetting(false);
          fetchShortcuts();
        }}
      />
      <Card
        iconfont="changyongyingyong"
        showMore
        title="常用应用"
        className="shortcut"
        style={{
          overflow: "visible",
        }}
        bodyStyle={{
          overflow: "visible",
        }}
        onClickMore={() => {
          setShowSetting(true);
        }}
      >
        <Menu.MenuItemList items={shortcuts}>
          {showPlusTrigger && <Menu.MenuItem {...plusTrigger} />}
        </Menu.MenuItemList>
      </Card>
    </>
  );
};
export default Shortcut;
