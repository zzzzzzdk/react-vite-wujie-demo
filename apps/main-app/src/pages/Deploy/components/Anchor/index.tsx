import classnames from "classnames";
import "./index.scss";
export type AnchorProps = {
  id: string;
  text: string;
  active?: boolean;
  onClick?: (anchorId: string) => void;
};

export default function Anchor(props: AnchorProps) {
  const { id, text, active, onClick } = props;
  const handleClick = () => {
    const dom = document.querySelector(`#${id}`);
    if (!dom) return;
    dom.scrollIntoView({ behavior: "smooth" });
    onClick?.(id);
  };

  return (
    <span
      className={classnames("deploy-anchor", {
        "deploy-anchor--active": active,
      })}
      onClick={handleClick}
    >
      {text}
    </span>
  );
}
