/* 布控单*/
import React, { useEffect, useState } from "react";
import classnames from "classnames";

import {
  DeployItem,
  DeployStatus,
  BkType,
  Measure,
  DeployTime,
  CloseType,
} from "../DeployDetail/interface";
import { Message, Link } from '@yisa/webui'
import Anchor, { AnchorProps } from "../components/Anchor";
import Heading from "../components/Heading";
/* 右侧内容块 */
import { DeploymentBlockProps } from "./interface";
import DeploymentBlock from "./blocks";

import "./index.scss";
import DeployStatusIcon from "../components/DeployStatusIcon";
import services from "@/services";
import { useParams } from "react-router-dom";
import MapContext from "../DeployWarning/MapContext";
import { BottomRight } from "@/components";
import TableAction from "../components/TableAction";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { UserInfoState } from "@/store/slices/user";
import ReviewingModal, { operationType } from "../DeployDetail/ReviewingModal";

export default function Deployment() {
  // 当前用户是否有审批权限
  const user = useSelector<RootState, UserInfoState>(
    (state) => (state.user as any).userInfo
  );
  const [hasPermission, setHasPermission] = useState(false);
  useEffect(() => {
    services.deploy
      .isApprover<any, { approveMonitor: boolean }>()
      .then((res) => {
        setHasPermission(!!res.data?.approveMonitor);
      });
  }, [user]);

  // 是不是同一个用户
  const sameUser = (currentUser: UserInfoState, u2: any) =>
    String(currentUser.id) === String(u2.userUUID);

  const [showReviewModal, setShowReviewModal] = useState<operationType>();

  const [deployItem, setDeployment] = useState<DeployItem>({
    jobId: "", // 布控单号
    title: "", // 布控标题
    bkType: BkType.Target,
    deployTimeType: DeployTime.Forever,
    measure: Measure.Capature, // 采取措施
    timeRange: {}, // 布控时间
    locationIds: [], // 点位范围
    createTime: "", // 创建时间
    approveTime: "", // 审批时间
    status: "reviewing", // 布控状态
    createUser: {
      userUUID: "",
      userName: "",
    }, // 创建人
    approveUser: {
      userUUID: "",
      userName: "",
    }, // 审批人
    receiveUsers: [],
    monitorList: [],
    permissions: [],
    monitorItemCount: 0,
  });
  const anchors: (AnchorProps & { Comp: React.FC<DeploymentBlockProps> })[] = [
    {
      id: "basic",
      text: "基本信息",
      Comp: DeploymentBlock.BasicInfo,
    },
    {
      id: "target",
      text: "布控目标",
      Comp: DeploymentBlock.DeployTarget,
    },
    {
      id: "creator",
      text: "创建人",
      Comp: DeploymentBlock.Creator,
    },
    {
      id: "receiver",
      text: "告警接收人",
      Comp: DeploymentBlock.Receiver,
    },
    {
      id: "approver",
      text: "审批人",
      Comp: DeploymentBlock.Approver,
    },
    {
      id: "status",
      text: "当前状态",
      Comp: DeploymentBlock.CurrentStatus,
    },
  ];

  const [activeLick, setActiveLink] = useState("basic");
  const { jobId } = useParams();
  useEffect(() => {
    getDeployDetails()
  }, []);
  const [showMap, setShowMap] = useState(false);
  const [lnglat, setLngLat] = useState<Record<"lng" | "lat" | "name", string>>({
    name: "",
    lng: "",
    lat: "",
  });

  const getDeployDetails = () => {
    services.deploy
      .getDeploymentDetail<any, DeployItem>({ jobId: Number(jobId) })
      .then((res) => {
        if (!res.data) return;
        const deployItem = res.data;
        setDeployment(deployItem);
      });
  }
  return (
    <section className="deployment">
      <aside>
        <Heading level={1} round>
          任务列表
        </Heading>
        <menu>
          {anchors.map((anchor) => {
            return (
              <Anchor
                active={anchor.id === activeLick}
                key={anchor.id}
                onClick={(id) => {
                  setActiveLink(id);
                }}
                {...anchor}
              />
            );
          })}
        </menu>
      </aside>
      <main>
        <header>
          <Heading showBar={false}>{deployItem.title}</Heading>
          <DeployStatusIcon deployItem={deployItem} />

          {
            deployItem.status === 'monitoring' || deployItem.status === 'reject' ?
              <Link href={`#/deploy-warning/${deployItem.jobId}`} target="_blank">查看告警</Link>
              :
              deployItem.status === 'reviewing'

                ?
                <TableAction
                  show={hasPermission && sameUser(user, deployItem.approveUser)}
                  // show={true}
                  item={deployItem}
                  onClick={() => {
                    setShowReviewModal("review");
                  }}>审批</TableAction>
                : ''
          }
        </header>
        <MapContext.Provider
          value={{
            showLngLat(...args) {
              setShowMap(true);
              setLngLat(...args);
            },
          }}
        >
          {showMap && (
            <BottomRight
              {...lnglat}
              onClose={() => {
                setShowMap(false);
              }}
            />
          )}
          <div className="scroll-area">
            {anchors.map((anchor) => {
              const { id, text, Comp } = anchor;
              return (
                <Comp key={id} id={id} deployItem={deployItem} title={text} />
              );
            })}
          </div>
        </MapContext.Provider>
        <ReviewingModal
          modalType={showReviewModal}
          deployItem={deployItem}
          close={() => setShowReviewModal(undefined)}
          onSuccess={() => {
            Message.success("操作成功");
            getDeployDetails()
          }}
        />
      </main>
    </section>
  );
}
