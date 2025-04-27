export type Method = 'get' | 'post' | 'put' | 'delete' | 'patch'
export type PlateTypeId = -1 | 1 | 2 | 5 | 6 | 9 | 15 | 16
export interface PlateProps {
  "plateTypeId": PlateTypeId,
  "plateNumber": string,
  "noplate": string
}
export interface BaseInfoProps {
  title?: string,
  type?: string,
  hasEditBtn?: boolean,
  data: { idNumber: string, groupId: string[], feature: string, idType: string },
  getUrl?: string
  changeUrl?: string
  showPagination?: boolean,
  handleChangeTabKey?: (key: string, data: any) => void
  handleChangePerson?: (data: any) => void
  personInfoData?: any
}
export interface CaseData {
  "id": string,
  "caseName": string,
  "caseNumber": string,
  "caseType": string,
  "caseTypeText": string,
  "caseClassify": string,
  "caseStatus": string
  "caseStatusText": string
  "caseRegionName": string,
  "caseTimes": string[],
  "casePlace": string,
  "lngLat": {
    "lat": string,
    "lng": string
  },
  "caseLabels": {
    "id": string,
    "name": string
  }[],
  "imformantName": string,
  "handleName": string[],
  "involvePerson": {
    "name": string,
    "idNumber": string,
    "personPhoto": string
    idType:string
  }[],
  caseDetails: string
}
export interface CarData {
  infoId: string
  key: string
  action: string
  locationName: string
  lngLat: { lat: string, lng: string }
  "licensePlate"?: string,
  "plateColor"?: number,
  "vehicleCategory"?: string,
  "registeredVehicleModel"?: string,
  "identifyVehicleModel"?: string,
  "vehicleColor"?: string,
  "firstRegistrationDate"?: string,
  "registrationDate"?: string,
  "vehicleStatus"?: string,
  "violationRecord"?: 0,
  "vehicleImage"?: string,
  "labels"?: []
  type?: string
}
export interface PersonData {
  "sexId": string,
  "sex": string,
  "nationId": string,
  "nation": string,
  "age": string,
  birthday: string,
  "marriageId": string,
  "marriage": string,
  "idCardType": string,
  "educationId": string,
  "education": string,
  "nativeId": string[],
  "native": string,
  "nativeAddress": string,
  "idNumber": string,
  "religiousId": string,
  "religious": string,
  "domicileId": string[],
  "domicile": string,
  "domicileAddress": string,
  "work": string,
  "currentId": string[],
  "current": string,
  "currentAddress": string,
  "createTime": string,
  "updateTime": string
}
export interface PhotoData {
  infoId: string,
  collectTime: string,
  feature: string,
  userName: string,
  url: string
  effective: number
  type?: string
  targetImage: string
}

export interface FormData {
  idNumber?: string, groupId?: string[], data?: any[],
  transportType?: string
  pageNo?: number
  pageSize?: number
}

export interface TableFormData {
  id: string,
  accountNumber: string,
  phoneType: string,
  phoneTypeId: string,
  source: string,
  sourceAndUpdateTime: string,
  addressType: string,
  addressTypeId: string,
  placeCode: string[]
  place: string
  address: string,
  // type: string,
}
export interface TabTableData {
  travelDate: string,
  trainNumber: string,
  seatNumber: string,
  transportType: string
  departure: string,
  destination: string
  source: string
}
