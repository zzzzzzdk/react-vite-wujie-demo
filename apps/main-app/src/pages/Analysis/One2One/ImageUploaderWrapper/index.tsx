/**
 * 以图检索 1:1
 */
import React, { useState } from "react";
import { Image, Message, Modal, Radio } from "@yisa/webui";
import { CloseOutlined } from "@yisa/webui/es/Icon";
import { ImgUpload, ImgUploadOrIdcard, Card } from "@/components";
import ImgUploadProp from "@/components/ImgUpload/interface";
import classnames from "classnames";
import services from "@/services";
import type { TargetFeatureItem } from "@/config/CommonType";
import { PhotoData } from "@/pages/Search/record/detail/components/BaseInfo/components/interface";
import { ResultBox } from '@yisa/webui_business'
import "./index.scss";

interface ImageUploadWarpperProps {
  img: TargetFeatureItem | null;
  onRemove: () => void;
  onChange: ImgUploadProp["onChange"];
  idCard?: boolean;
  side?: "left" | "right";
}

const ImageUploaderWarpper = ({
  img,
  onChange,
  onRemove,
  idCard = false,
  side = "left",
}: ImageUploadWarpperProps) => {
  const [ajaxLoading, setAjaxLoading] = useState(false);
  const [resultData, setResultData] = useState<PhotoData[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<PhotoData | null>(null);

  const handleIdCardSearch = (idCard: string) => {
    console.log("handleIdCardSearch", idCard);
    setAjaxLoading(true);
    services.record.getDetailPhotoLists<{
      idNumber: string,
      idType: string
    }, PhotoData[]>({
      idNumber: idCard,
      idType: '111'
    })
      .then(res => {
        setAjaxLoading(false);
        setResultData(res.data || []);
        setIsModalVisible(true); // 显示弹窗
      })
      .catch(err => {
        setAjaxLoading(false);
        Message.error(err.message || "获取失败");
      });
  };

  const handleModalOk = () => {
    if (!selectedPerson) {
      Message.error("请选择人员");
      return
    }
    if (selectedPerson && onChange) {
      onChange([
        {
          ...selectedPerson,
          targetType: "face",
        },
      ] as any);
    }
    setIsModalVisible(false);
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
  };

  const handleSelectPerson = (person: PhotoData) => {
    setSelectedPerson({
      ...person,
    });
  };

  const preview = (
    <div className="preview">
      <Image src={img?.targetImage} />
      <span
        className="remove"
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
      >
        <CloseOutlined />
      </span>
    </div>
  );

  const uploader = (
    <>
      <h2 className="label">
        请上传
        <span>目标</span>
        图片
      </h2>
      <ImgUpload
        limit={1}
        multiple={false}
        showHistory={false}
        onChange={onChange}
        innerSlot={<div className="uploader-trigger" />}
      />
      {idCard && (
        <ImgUploadOrIdcard
          formItemProps={{ label: "" }}
          infoValue="idcard"
          showTab={false}
          onClusterChange={(d) => {
            if (!d) return;
            if (onChange) {
              onChange([
                {
                  ...d,
                  targetType: "face",
                },
              ] as any);
            }
          }}
          onIdCardSearch={handleIdCardSearch}
          loading={ajaxLoading}
        />
      )}
    </>
  );

  return (
    <div
      className={classnames("one2one-uploader", {
        "left-bg": side === "left",
        "right-bg": side === "right",
      })}
      style={{
        paddingTop: !!img ? "30px" : "50px",
      }}
    >
      {!!img ? preview : uploader}
      <Modal
        title="选择人员"
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        className="person-selected-modal"
        {...(
          !resultData.length ? { footer: null } : {}
        )}
      >
        <ResultBox
          loading={ajaxLoading}
          nodata={!resultData || (resultData && !resultData.length)}
        >
          <Radio.Group>
            {resultData.map((person, index) => (
              <Radio value={person} onChange={() => handleSelectPerson(person)} key={index}>
                <Card.Normal
                  cardData={{
                    ...person,
                    captureTime: person.collectTime,
                  }}
                  showChecked={false}
                  hasfooter={false}
                />
              </Radio>
            ))}
          </Radio.Group>

        </ResultBox>
      </Modal>
    </div>
  );
};
export default ImageUploaderWarpper;
