export default interface PersonInfoType {
  targetImage: string
  personBasicInfo: {
    name: string
    sex: string
    age: number | string
    nation: string
    idcard: string
    idcardUrl: string
  }
  personTags: string[]
  captureTime: string
  // [key:string]:string

}
