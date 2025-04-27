import { logReport } from "@/utils/log";
import { Button, Tooltip } from "@yisa/webui";
// 批量以图检索

type ImageSearchBtnProps = {
  featureList: any[];
};
const ImageSearchBtn: React.FC<ImageSearchBtnProps & object> = (props) => {
  const { featureList = [] } = props;

  const handleJump = () => {
    // 日志提交
    logReport({
      type: "image",
      data: {
        desc: `图片【${featureList.length}】-【批量操作：以图检索】`,
        data: featureList,
      },
    });

    const params = featureList.map((item) => ({
      bigImage: item.bigImage,
      feature: item.feature,
      targetType: item.targetType,
      targetImage: item.targetImage,
    }));

    window.open(
      `#/image?featureList=${encodeURIComponent(JSON.stringify(params))}`
    );
  };

  return (
    <Tooltip title="仅可选取5个目标">
      <Button
        size="small"
        disabled={!featureList.length || featureList.length > 5}
        onClick={handleJump}
      >
        以图检索
      </Button>
    </Tooltip>
  );
};
export default ImageSearchBtn;
