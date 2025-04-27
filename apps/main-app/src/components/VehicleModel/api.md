# API

属性说明：

|参数名|描述|类型|默认值|版本|
|---|---|---|---|---|
|className|类名|string|-|-|
|style|节点样式|Object|-|-|
|wrapperClassName|下拉框类型|string|-|-|
|wrapperStyle|下拉框样式|Object|-|-|
|disabled|是否禁用|boolean|-|-|
|placeholder|提示文字|string|'请选择'|-|
|searchPlaceholder|搜索框提示文字|string \| string[]|'搜索'|-|
|renderFormat|定制显示内容|(brand: brandProps \| brandProps[] \| undefined, model: modelProps[] \| undefined, year: yearProps[] \| undefined) => ReactNode|-|-|
|hotBrands|热门品牌值|(string \| number)[]|-|-|
|brandData|车辆品牌数据|{ [key: string \| number]: brandProps }|-|-|
|modelData|车辆型号数据|{ [key: string \| number]: modelProps[] }|-|-|
|yearData|车辆年款数据|{ [key: string \| number]: yearProps[] }|-|-|
|brandValue|车辆品牌值|value \| value[]|-|-|
|modelValue|车辆型号值|value[]|-|-|
|yearValue|车辆年款值|value[]|-|-|
|notFoundContent|无数据|ReactNode|-|-|
|size|尺寸|'mini' \| 'small' \| 'default' \| 'large'|-|-||
|error|错误状态|string \| boolean|-|-|
|allowClear|是否开启清除|boolean|-|-|
|clearIcon|清除图标|ReactNode|-|-|
|arrowIcon|箭头图标|ReactNode|-|-|
|loading|加载中|boolean|-|-|
|loadingIcon|加载图标|ReactNode|-|-|
|bordered|无边框|boolean|-|-|
|separator|分隔符|string|'\/'|-|
|getTriggerContainer|下拉框渲染父节点|() => HTMLElement|() => document.body|-|
|getTargetContainer|目标元素|() => HTMLElement|-|-|
|maxHeight|最大高度|number|540|-|
|destroyPopupOnHide|隐藏后销毁元素|boolean|-|-|
|onFocus|获取焦点|(e) => void|-|-|
|onBlur|失去焦点|(e) => void|-|-|
|onChange|变化回调|(brandValue: value \| value[] \| undefined, modelValue: value[],yearValue: value[],extra: {brandData: brandProps \| brandProps[] \| undefined,modelData: modelProps[],yearData: yearProps[]}) => void|-|-|

```ts
export interface brandProps {
  v: string;
  k: string;
  nodes?: brandProps[];
}

export interface modelProps {
  v: string;
  k: string;
}

export interface yearProps {
  v: string;
  k: string;
}

export type value = string;
```
