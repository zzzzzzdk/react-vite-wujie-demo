import { useEffect, useRef, useState } from 'react'
import { Row, Col, Message, Loading } from "@yisa/webui";
import { Icon } from '@yisa/webui/es/Icon'
import services, { ApiResponse } from '@/services'
import "./index.scss";
import particle from './js/particle.js'
import SearchBar from './components/SearchBar';
// import { AspectRatioBox } from "@/components"
import { ItemMenu } from '@/store/slices/user';
import { MenuItem } from './components/Menu';
import Color from './components/Menu/color'
import { RootState, useSelector } from '@/store';
import classNames from 'classnames';
import RightTools from '../Layout/RightTools';
export type ItemMenuArrayType = {
  icon: string;
  text: string;
  left: number;
  top: number;
  textLeft?: number,
  name?: string
}
// const leftItemArray: ItemMenuArrayType[] = [
//   {
//     icon: "mubiaojiansuo",
//     text: "目标检索",
//     name: "search",
//     left: 104,
//     top: 204
//   },
//   {
//     icon: "jingwudamoxing",
//     text: "警务大模型",
//     name: "llm",
//     left: 250,
//     top: 88,
//     textLeft: -12
//   },
//   {
//     icon: "cheliangyanpan2",
//     text: "车辆研判",
//     name: "vehicle-judgment",
//     left: 424,
//     top: 120
//   },
//   {
//     icon: "changyonggongneng",
//     text: "常用功能",
//     left: 488,
//     top: 300,
//     name: "commonapp"
//   },
//   {
//     icon: "jiexiguanli",
//     text: "解析管理",
//     name: "analysis",
//     left: 416,
//     top: 474
//   },
//   {
//     icon: "bukonggaojing",
//     text: "布控告警",
//     name: "warning",
//     left: 232,
//     top: 496
//   },
//   {
//     icon: "renyuanyanpan2",
//     text: "人员研判",
//     name: "person-judgment",
//     left: 104,
//     top: 392
//   },
// ]


const leftItemArray: ItemMenuArrayType[] = [
  {
    icon: "mubiaojiansuo",
    text: "目标检索",
    name: "search",
    left: 400,
    top: 96
  },
  // {
  //   icon: "jingwudamoxing",
  //   text: "警务大模型",
  //   name: "llm",
  //   left: 196,
  //   top: 96,
  //   textLeft: -12
  // },
  {
    icon: "cheliangyanpan2",
    text: "车辆研判",
    name: "vehicle-judgment",
    left: 498,
    top: 292,
  },
  {
    icon: "changyonggongneng",
    text: "常用功能",
    left: 400,
    top: 486,
    name: "commonapp"
  },
  {
    icon: "jiexiguanli",
    text: "解析管理",
    name: "analysis",
    left: 196,
    top: 486
  },
  {
    icon: "bukonggaojing",
    text: "布控告警",
    name: "warning",
    left: 78,
    top: 292
  },
  {
    icon: "renyuanyanpan2",
    text: "人员研判",
    name: "person-judgment",
    left: 196,
    top: 96,
  },
]
const Home = () => {
  const systemType = window.YISACONF.systemControl?.type || 'fusion3'
  const menuData = useSelector((state: RootState) => {
    return state.user.menu
  })
  const [leftItem, setLeftItem] = useState(leftItemArray)
  const [curLeftItem, setCurLeftItem] = useState<ItemMenuArrayType>(leftItemArray.find(item => item.text === "常用功能") || leftItemArray[0])
  const [loading, setLoading] = useState(true)
  const [commonApps, setCommonApps] = useState<ItemMenu[]>([])
  const rightContainerRef = useRef<HTMLDivElement>(null)

  const curItemApps = curLeftItem.name === "commonapp" ? commonApps : menuData.find(item => item.icon === curLeftItem.icon)?.children || []

  // console.log(curItemApps,menuData,curLeftItem)

  const handleLeftItemClick = (item: ItemMenuArrayType) => {
    if (item.name !== "commonapp" && !menuData.find(it => it.name === item.name)) {
      Message.warning(`暂未部署${item.text}`)
      return
    }
    if (item.name === 'llm') {
      const currentPath = menuData.find(menu => menu.name === item.name)?.path
      window.open(currentPath)
      return
    }

    if (rightContainerRef.current) {
      rightContainerRef.current.animate([
        { transform: "translateX(300px)", opacity: 0 },
        { transform: "translateX(0)", opacity: 1 }
      ], {
        duration: 200
      })
    }
    setCurLeftItem(item)

  }
  const handleMenuItemClick = (item: ItemMenu) => {
    if (/^https?:/.test(item.path)) {
      window.open(item.path);
    } else {
      window.open(`#${item.path}`);
    }
  }

  // useEffect(() => {
  //   particle?.()
  // }, [])

  useEffect(() => {
    setLoading(true);
    services.homepage
      .getShortcuts<null, ItemMenu[]>()
      .then((res) => {
        if (!Array.isArray(res.data)) return;
        setCommonApps(res.data);
      })
      .catch((e) => {
        console.error(e);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [])

  return (
    <>
      <div className="homepage">
        <canvas id="particle-effect"></canvas>
      </div>
      <div className="homepage-wrapper">
        <header className={classNames("homepage-wrapper-header", systemType)}>
          {systemType === 'fusion3' ? <span className='sys-text'>{window.YISACONF.sys_text}</span> : ''}
          <RightTools />
        </header>
        <SearchBar />
        <main className="homepage-wrapper-container">
          <div className="left-box">
            {/* <AspectRatioBox
              ratio={664 / 721}
            > */}
              <div className="left">
                {
                  leftItem.map(item => <div
                    key={item.icon}
                    className={`left-item ${item.icon === curLeftItem.icon ? "active" : ""}`}
                    style={{ left: item.left, top: item.top }}
                    onClick={() => { handleLeftItemClick(item) }}
                  >
                    <Icon type={item.icon} />
                    <span className="text" style={{ left: item.textLeft || 0 }}>{item.text}</span>
                  </div>)
                }
                <div className="middle-text">{window.YISACONF?.circle_text || "全部功能"}</div>
              </div>
            {/* </AspectRatioBox> */}
          </div>
          <div className="right-box">
            {/* <AspectRatioBox
              ratio={462 / 536}
            > */}
              <div className="right" >
                {loading ? <Loading spinning={loading} size="large" /> :
                  <>
                    <div className="right-title">{curLeftItem.text}</div>
                    <div className="right-item-wrapper" ref={rightContainerRef}>
                      {curItemApps.map((item, idx) => <div className="right-item" key={idx} onClick={() => { handleMenuItemClick(item) }}>
                        <div className="icon" style={{ background: Color[String(item.name).toLowerCase()] }}><Icon type={item.icon} /></div>
                        <div className="text">{item.text}</div>
                      </div>)
                      }
                    </div>
                  </>
                }
              </div>
            {/* </AspectRatioBox> */}
          </div>
        </main>
      </div>
    </>
  );
};
export default Home;
