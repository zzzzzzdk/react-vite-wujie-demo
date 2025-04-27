export type FormInputProps={
  maxSize:number
  maxText:string
  placeholder?:string,
  defaultValue:File[],
  onChange:(fileList:File[])=>void
}