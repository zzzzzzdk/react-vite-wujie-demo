# API

```tsx
/**
 * 放大镜位置类型 : 图片在放大镜的左边/右边
 * /
type PositionType = 'left' | 'right'
```

属性说明：
|参数名|描述|类型|默认值|版本|
|---|---|---|---|---|
|imgSrc|图片路径|string|-|-|
|position|放大镜显示的位置|PositionType|'left'|-|
|scale|是否等比例缩放|boolean|true|-|