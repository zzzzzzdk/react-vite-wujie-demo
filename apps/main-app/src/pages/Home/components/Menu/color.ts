
export const ColorPicker = [
  // "linear-gradient(137deg,#a8cbff 8%, #3575ff 91%)",
  // "linear-gradient(137deg,#89abe3 15%, #415ba5 86%)",
  // "linear-gradient(131deg,#a4e7ff 6%, #2cb1e2 94%)",
  // "linear-gradient(137deg,#88f3e6 15%, #04bfb7 86%)",
  // "linear-gradient(131deg,#febab4 6%, #e25145 94%)",
  // "linear-gradient(135deg,#81f3d0 8%, #0c9c87 91%)",
  "#3575ff",
  "#415ba5",
  "#2cb1e2",
  "#04bfb7",
  "#e25145",
  "#0c9c87",
];

const routes = [
  "target",
  "cluebank",
  "create-track",
  "image",
  "cross",
  "offline",
  "history",
  "one2one",
  "n2n",
  "n2n-result",
  "home",
  "initial",
  "deploy",
  "vehicle-peer",
  "foothold-vehicle",
  "deploy-detail",
  "deployment",
  "deploy-warning",
  "warning-detail",
  "vehicle-multipoint",
  "doublecar",
  "vehicle-track",
  "person-multipoint",
  "person-track",
  "face-peer",
  "active-night",
  "foothold-person",
  "vehicle-clone",
  "vehicle-fake",
  "frepass",
  "regional-mapping",
  "record-detail-person",
  "record-detail-vehicle",
  "record-list",
  "record-search",
  "auth-approve",
  "real-time-tracking",
  "label-manage"
];

const Color: Record<string, string> = {};
routes.forEach((r, idx) => {
  Color[r] = ColorPicker[idx % ColorPicker.length];
  return {
    [r]: ColorPicker[idx % ColorPicker.length],
  };
});
console.log(Color);
export default Color;
