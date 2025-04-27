import React, {
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Form,
  Input,
  Select,
  Button,
  Space,
  Table,
  Pagination,
  Checkbox,
  PopConfirm,
  Message,
} from "@yisa/webui";

import classNames from "classnames";
import { CloseOutlined, InfoCircleFilled } from "@yisa/webui/es/Icon";

import { ResultBox } from "@yisa/webui_business";

import type { ColumnProps, TableProps } from "@yisa/webui/es/Table";
import type { PaginationProps } from "@yisa/webui/es/Pagination/interface";

import { ResultHeader, TimeRangePicker, Export } from "@/components";
import services from "@/services";
import dictionary from "@/config/character.config";

import AddN2NTask from "./AddN2NTask/index.";

import { Icon } from "@yisa/webui/es/Icon";
import {
  SearchForm,
  Task,
  RawTask,
  TaskStatus,
  DB,
  DBType,
  DBName,
} from "./interface";
import { FormItemConfig } from "@/pages/Deploy/components/FormWrapper/interface";
import FormWrapper from "@/pages/Deploy/components/FormWrapper";

import "./index.scss";
import dayjs from "dayjs";
import type { OfflineFile } from "./AddN2NTask/index.";
import TableAction from "@/pages/Deploy/components/TableAction";
import useHandleDbClick from "./useHandleDbClick";
import { useResetState } from "ahooks";

const Option = Select.Option;
const TaskStatusSetting: Record<
  keyof typeof TaskStatus,
  {
    text: string;
    icon: string;
    color: string;
  }
> = {
  // All: { text: "不限", icon: "", color: "" },
  Processing: { text: "解析中", icon: "jiexizhong", color: "#FF8D1A1A" },
  Comparing: { text: "比对中", icon: "duibizhong", color: "#3377FF1A" },
  Failed: { text: "已失败", icon: "yishibai", color: "#FF5B4D1A" },
  Done: { text: "已完成", icon: "yichenggong", color: "#00CC661A" },
};

const initFormData: () => SearchForm = () => ({
  minCreateTime: dayjs()
    .subtract(6, "days")
    .startOf("day")
    .format("YYYY-MM-DD HH:mm:ss"),
  maxCreateTime: dayjs().format("YYYY-MM-DD HH:mm:ss"),
  page: 1,
  pageSize: dictionary.pageSizeOptions[0],
});

type N2NFormProps = {
  loading: boolean;
  onSearch: (form: SearchForm) => void;
};
const N2NForm = React.forwardRef<
  {
    forceSearch: () => void;
  },
  N2NFormProps
>((props, ref) => {
  const { loading, onSearch: onSubmit } = props;
  const [formData, setFormData, resetFormData] = useResetState<SearchForm>(initFormData);
  const handleSearch = () => {
    console.log(formData);
    onSubmit(formData);
  };

  useImperativeHandle(ref, () => {
    return {
      forceSearch: handleSearch,
    };
  });
  return (
    <Form className={`search-form`} layout="vertical" inline colon={false}>
      <Form.Item label="任务名称">
        <Input
          maxLength={30}
          placeholder="模糊搜索"
          value={formData.taskName}
          onChange={(e) => {
            setFormData({
              ...formData,
              taskName: e.target.value,
            });
          }}
        />
      </Form.Item>
      <Form.Item label="库名">
        <Input
          maxLength={30}
          placeholder="模糊搜索"
          onChange={(e, value) => {
            setFormData({
              ...formData,
              dbName: value,
            });
          }}
        />
      </Form.Item>
      <Form.Item label="任务状态">
        <Select
          // defaultValue={TaskStatus.All}
          maxTagCount={1}
          mode="multiple"
          onChange={(v) => {
            // console.log(v);
            setFormData({
              ...formData,
              taskStatus: v as TaskStatus[],
            });
          }}
          // @ts-ignore
          getTriggerContainer={(triggerNode) =>
            triggerNode.parentNode as HTMLElement
          }
        >
          {Object.entries(TaskStatusSetting).map(([status, setting]) => (
            <Option key={status} value={TaskStatus[status]}>
              {setting.text}
            </Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item label="创建人">
        <Input
          maxLength={30}
          placeholder="模糊搜索"
          onChange={(e, value) => {
            setFormData({
              ...formData,
              uname: value,
            });
          }}
        />
      </Form.Item>
      <TimeRangePicker
        className="date-picker"
        showTimeType={false}
        formItemProps={{ label: "创建时间" }}
        beginDate={formData.minCreateTime}
        endDate={formData.maxCreateTime}
        onChange={(range) => {
          setFormData({
            ...formData,
            minCreateTime: range.beginDate,
            maxCreateTime: range.endDate,
          });
        }}
      />
      <Form.Item>
        <Space size={10}>
          <Button disabled={loading} onClick={() => { resetFormData() }} type='default' className="reset-btn">重置</Button>
          <Button
            disabled={loading}
            className="btn-search"
            type="primary"
            onClick={handleSearch}
          >
            查询
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
});
export default N2NForm;
