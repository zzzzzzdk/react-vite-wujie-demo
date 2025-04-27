

import Peer from './Peer'
import { useLocation } from 'react-router'

export default function PeerContainer() {
  let pathname = useLocation().pathname,
    module: "vehicle" | "face" = "vehicle"
  const moduleArr = (/^\//.test(pathname) ? pathname.slice(1) : pathname).split("-").filter(item => item !== "peer")
  moduleArr.length && (module = moduleArr[0] as "vehicle" | "face")

  return <Peer key={module} module={module} />

}
