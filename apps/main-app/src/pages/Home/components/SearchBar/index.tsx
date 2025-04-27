import { SearchInputHome } from "@/components";
import Card from "../Card";
import { useNavigate } from "react-router-dom";
import { CaptureData, FormDataProps } from "@/components/SearchInput/interface";
import services, { ApiResponse } from "@/services";

export type searchBarType = {
  type?: "technology" | "default"
}

const SearchBar = (props: searchBarType) => {
  const { type = "technology" } = props
  // 获取检索条件信息展示
  const navigate = useNavigate();
  const getConditionsData = (form: {
    data?: FormDataProps;
    searchType?: string;
  }) => {
    services.record
      .getConditionsData<
        (FormDataProps) & { searchType: string },
        ApiResponse<string>
      >({
        ...(form?.data || {} as FormDataProps),
        searchType: form.searchType || "",
      })
      .then((res) => {
        let resultData;
        if (res.data) {
          resultData = { ...form, text: res.data || "" };
        }
        navigate(
          `/record-list?${encodeURIComponent(JSON.stringify(resultData))}`
        );
      });
  };

  // 检索
  const handleSearch = (resultData: any) => {
    if (resultData.searchType) {
      // 添加历史记录并获取拼接字段信息
      getConditionsData(resultData);
    } else {
      window.open(
        `#/record-list?${encodeURIComponent(JSON.stringify(resultData))}`
      );
    }
  };
  return (
    <SearchInputHome onSearch={handleSearch} searchType="list" type={type} />
  );
};

export default SearchBar;
