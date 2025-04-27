# API

属性说明：

|参数名|描述|类型|默认值|版本|
|---|---|---|---|---|
|className|类名|string|-|-|
|placeholder|输入框提示文字|string|请输入|-|
|value|值|PlateValueProps|{plate_type_id: '-1',plate_number: '',noplate: ''}|-|
|onChange|值发生变化|(value: PlateValueProps) => void|-|-|
|isShowNoPlate|是否显示无车牌按钮|boolean|false|-|
|isShowKeyboard|是否显示选择车牌号面板|boolean|false|-|
|selectFocusInput|点击键盘面板是否聚焦回input|boolean|true|-|
|keyboardClassName|弹框类名|string|-|-|
|isShowColor|是否显示车牌颜色选择|boolean|true|-|
|isShowNoLimit|车牌颜色显示不限，当为false时车牌默认蓝色 '1' |boolean|true|-|
|placement|位置，可选 top left right bottom|placement|bottom|-|
|verticalDis|上下距离|number|0|-|
|horizontalDis|左右距离|number|0|-|
|province|默认省份|string|京|-|
|disabled|是否禁用|boolean|false|-|
|getPopupContainer|获取挂在到哪个元素上|() => void|() => document.body|-|
|remind|弹窗底部提示信息|React.ReactNode|<div>提示：模糊搜索时可用“*”代替任意位数，“？”代替一位。如：${province}*45，${province}A？34？5</div>|-|


PlateValueProps

|参数名|描述|类型|默认值|版本|
|---|---|---|---|---|
|plate_type_id|车牌颜色|PlateTypeId|-1|-|
|plate_number|车牌号|string|''|-|
|noplate|是否是无牌，'noplate'为无车牌|noplate|''|-|


type PlateTypeId = '-1' | '1' | '2' | '3' | '4' | '5' | '6' | '7'

type noplate = '' | 'noplate'

type placement = "top" | "left" | "right" | "bottom"



### 键盘中的选择项（不可配置）

```js
[
    ['京', '沪', '津', '渝', '黑', '吉', '辽', '蒙', '冀', '新', '甘', '青', '陕', '宁', '豫', '鲁', '晋', '皖', '鄂', '湘', '苏', '川', '贵', '云', '桂', '藏', '浙', '赣', '粤', '闽', '琼', '广', '港', '澳'],
    ['WJ', '军', '空', '警', '学', '挂'],
    ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
    ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],
    ['*', '?']
]
```

### 车牌颜色（不可配置）

```js
[
  {
    "label": '不限',
    "value": '-1'
  }, {
    "label": '蓝色',
    "value": '1'
  }, {
    "label": '黄色',
    "value": '2'
  }, {
    "label": '绿色',
    "value": '3'
  }, {
    "label": '新能源绿',
    "value": '4'
  }, {
    "label": '新能源黄绿',
    "value": '5'
  }, {
    "label": '白色',
    "value": '6'
  }, {
    "label": '黑色',
    "value": '7'
  }
]
```

