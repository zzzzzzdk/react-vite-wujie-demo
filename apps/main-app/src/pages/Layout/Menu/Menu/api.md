# API

属性说明：

|参数名|描述|类型|默认值|版本|
|---|---|---|---|---|
|type|菜单的方向|vertical \| horizontal|vertical|-|
|link|链接方式，可传入react-router的Link|ReactNode|-|-|
|openKeys|展开的值|string[]|-|-|
|className|节点类名|string|-|-|
|onCollapsed|整体导航展开收起发生变化|(e: any) => void|-|-|
|onOpen|展开收起发生变化|(e: any) => void|-|-|
|onChange|选中菜单发生变化|(e: any) => void|-|-|
|data|菜单需要的数组数据|DataItem[]|-|-|
|activeKey|选中的菜单|string|-|-|
|inlineCollapsed|type为vertical是否收起,hover:true时此属性无效|boolean|-|-|
|hover|竖着展开模式是否为hover|boolean|false|-|
|fixed|是否固定hover:true时起效|boolean|false|-|
|onFixed|固定发生变化 hover:true时起效|(e: any) => void|-|-|
|onHoverChange|进入或者离开 hover:true时起效|(e: boolean) => void|-|-|
|mouseLeaveTime|收起延迟时间 hover:true时起效|number|300|-|

DataItem属性说明：

|参数名|描述|类型|默认值|版本|
|---|---|---|---|---|
|title|菜单名称|string|-|-|
|icon|字体图标，只有第一层菜单有效|ReactNode \| string|-|-|
|children|下一级菜单，最多支持三级|DataItem[]|-|-|
|path|菜单路径也是唯一值，如果以http或者https开头会发开外部链接|string|-|-|
|target|同a标签的target|string|-|-|

