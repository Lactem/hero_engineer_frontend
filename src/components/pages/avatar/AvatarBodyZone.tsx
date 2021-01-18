import React from "react";
import { AvatarBodyZoneModel } from "../../../api/avatarsAPI"

import "./AvatarModal.scss"

// A specific zone of the body (mustache, iris, face shape, etc...) that can be modified. Related zones are grouped into AvatarBlocks
interface AvatarBodyZone {
  config: AvatarBodyZoneModel
  name: string
  title: string
  active: boolean
  blockActive: boolean
  onClick: Function
}
export const AvatarBodyZone = ({ config, name, title, active, blockActive, onClick }: AvatarBodyZone) => {
  return (
    <div
      id={"svga-bodyzones-" + name}
      className={"svga-bodyzones" + (active ? " svga-active" : "") + (blockActive ? " svga-bodyzone-display" : " svga-bodyzone-hidden")}
      data-bodyzone={name}
      data-controls={config.controls}
      data-block={config.block}
      onClick={(_) => onClick()}
    >
      {title}
    </div>
  )
}
