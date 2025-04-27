/**
 * 以图检索 1:1
 */
import React, { useState } from "react";
import {
  Input,
  Button,
  Modal,
  Radio,
  Divider,
  Message,
  Statistic,
  Form,
} from "@yisa/webui";
import type { RadioChangeEvent } from "@yisa/webui/es/Radio";
import { CloseOutlined } from "@yisa/webui/es/Icon";
import { ImgUpload, ImgUploadOrIdcard } from "@/components";
import ImgUploadProp from "@/components/ImgUpload/interface";

import type { TargetFeatureItem } from "@/config/CommonType";
import ImageUploaderWarpper from "./ImageUploaderWrapper";
import ajax from "@/services";
import "./index.scss";

type SimilarityPayload = Record<"targetType" | "feature1" | "feature2", string>;
type SimilarityResData = {
  similarity: string;
  evaluation: string;
};


const One2One = () => {
  // 左右两侧上传的图片
  const [leftImg, setLeftImg] = useState<TargetFeatureItem | null>(null);
  const [rightImg, setRightImg] = useState<TargetFeatureItem | null>(null);

  // 显示相似度
  const [similarity, setSimilarity] = useState<string | undefined>();
  // 是否上传了两张图片
  const haveTwoImgs = leftImg && rightImg;
  // 目标类型是否一致
  const areSameType = haveTwoImgs && leftImg.targetType === rightImg.targetType;

  // 点击对比按钮
  const handleCompare = (e: React.MouseEvent<HTMLElement>) => {
    //
    if (!haveTwoImgs) {
      Message.warning("请上传图片");
      return;
    }
    if (!areSameType) {
      Message.warning("目标类型需一致");
      return;
    }
    // 限制上传同一张图片/特征，后端计算相似度进度丢失问题
    if (leftImg.feature === rightImg.feature) {
      Message.warning("请上传不同图片");
      return;
    }
    ajax.one2one
      .getSimilarity<SimilarityPayload, SimilarityResData>({
        targetType: leftImg.targetType,
        feature1: leftImg.feature,
        feature2: rightImg.feature,
      })
      .then((res) => {
        if (res.data) {
          // debugger;
          const match = res.data.similarity;
          setSimilarity(match);
        } else {
          // TODO 错误情况需要验证
          Message.warning(res.message!);
        }
      })
      .catch((error) => {
        console.log("one2one/handlecompare", error);
      });
  };
  // 删除图片
  const handleRemoveImg = (target: "left" | "right" | "all") => {
    setSimilarity(undefined);
    switch (target) {
      case "left": {
        setLeftImg(null);
        return;
      }
      case "right": {
        setRightImg(null);
        return;
      }
      case "all": {
        setLeftImg(null);
        setRightImg(null);
        return;
      }
    }
  };

  return (
    <section className="page-content one2one">
      <h1 className="title">请上传图片进行1:1对比</h1>
      <div className="remove-all">
        {areSameType && (
          <Button onClick={() => handleRemoveImg("all")}>清除全部</Button>
        )}
      </div>
      <div className="wrappers">
        <ImageUploaderWarpper
          img={leftImg}
          onRemove={() => {
            handleRemoveImg("left");
          }}
          onChange={(featureList) => {
            if (featureList.length) {
              setLeftImg(featureList[0]);
            }
          }}
        />

        <ImageUploaderWarpper
          side="right"
          img={rightImg}
          onRemove={() => {
            handleRemoveImg("right");
          }}
          onChange={(featureList) => {
            if (featureList.length) {
              setRightImg(featureList[0]);
            }
          }}
          idCard
        />
        <div
          className={`compare ${similarity ? "compare--match" : ""}`}
          onClick={handleCompare}
        >
          {similarity && (
            <>
              <Statistic
                value={similarity}
                precision={2}
                valueStyle={{ color: "var(--base-color2)" }}
                suffix="%"
              />
              <div>相似度</div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default One2One;
