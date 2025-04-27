import Button from "./ExportBtn";
import Modal from "./ExportModal";
import Provider from "./store";
import { ExportProps } from "./interface";
import './index.scss'

export default function ExportBtn(props: ExportProps) {
  return (
    <Provider {...props}>
      <Button />
      <Modal />
    </Provider>
  );
}
