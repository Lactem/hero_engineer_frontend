import React, { ReactFragment, useEffect, useState } from "react"
import { AvatarBodyZoneModel } from "../../../api/avatarsAPI"

import "./AvatarModal.scss"
import { UserModel } from "../../../api/userAPI"
import { Tooltip } from "antd"

// A collection of shape options that can fill a zone of the avatar's body
interface AvatarBodyZoneElement {
  config: AvatarBodyZoneModel
  name: string
  active: boolean
  zoneActive: boolean
  onClick: Function
  user: UserModel
}
export const AvatarBodyZoneElement = ({
  config,
  name,
  active,
  zoneActive,
  onClick,
  user
}: AvatarBodyZoneElement) => {
  const [lockedOverlays, setLockedOverlays] = useState([] as ReactFragment[])

  useEffect(() => {
    let newLockedOverlays = []

    for (let i = 0; i < config.shapes.length; i++) {
      let shape = config.shapes[i]
      let lockedOverlay: ReactFragment = <></>
      let unlockCost = 0;
      if (shape.unlockInfo && shape.unlockInfo.defaultLocked) {
        if (!user.avatarUnlockedBodyZoneShapes
          || user.avatarUnlockedBodyZoneShapes.indexOf(shape.unlockInfo.lockedId) < 0) {
          unlockCost = shape.unlockInfo.unlockXpCost;
          if (user.xp >= unlockCost) {
            lockedOverlay = (
                <Tooltip title={"Click to unlock for " + unlockCost + " XP"}>
                  <div className="svga-element-locked-unlockable-overlay">
                    <svg viewBox="64 64 896 896" focusable="false" className="svga-element-locked-icon" data-icon="unlock" fill="green" aria-hidden="true"><path d="M832 464H332V240c0-30.9 25.1-56 56-56h248c30.9 0 56 25.1 56 56v68c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-68c0-70.7-57.3-128-128-128H388c-70.7 0-128 57.3-128 128v224h-68c-17.7 0-32 14.3-32 32v384c0 17.7 14.3 32 32 32h640c17.7 0 32-14.3 32-32V496c0-17.7-14.3-32-32-32zm-40 376H232V536h560v304zM484 701v53c0 4.4 3.6 8 8 8h40c4.4 0 8-3.6 8-8v-53a48.01 48.01 0 10-56 0z" />
                    </svg>
                  </div>
                </Tooltip>
            )
          } else {
            lockedOverlay = (
                <Tooltip title={"Locked (" + unlockCost + " XP)"}>
                  <div className="svga-element-locked-overlay">
                    <svg viewBox="64 64 896 896" focusable="false" className="svga-element-locked-icon" data-icon="lock" fill="black" aria-hidden="true"><path d="M832 464h-68V240c0-70.7-57.3-128-128-128H388c-70.7 0-128 57.3-128 128v224h-68c-17.7 0-32 14.3-32 32v384c0 17.7 14.3 32 32 32h640c17.7 0 32-14.3 32-32V496c0-17.7-14.3-32-32-32zM332 240c0-30.9 25.1-56 56-56h248c30.9 0 56 25.1 56 56v224H332V240zm460 600H232V536h560v304zM484 701v53c0 4.4 3.6 8 8 8h40c4.4 0 8-3.6 8-8v-53a48.01 48.01 0 10-56 0z" />
                    </svg>
                  </div>
                </Tooltip>
            )
          }
        }
      }
      newLockedOverlays[i] = lockedOverlay
    }

    setLockedOverlays(newLockedOverlays)
  }, [])

  return (
    <div
      id={"svga-elements-" + name}
      key={"svga-elements-" + name}
      className={`svga-elements-wrap-${zoneActive ? "display" : "hidden"}`}
    >
      {Object.keys(config.shapes).map((_, i) => (
        <div
          id={"svga-elements-" + name + "-" + i}
          key={"svga-elements-" + name + "-" + i}
          className={"svga-elements"}
          onClick={_ => onClick(name, i)}
        >
          {lockedOverlays && lockedOverlays[i] && <>{lockedOverlays[i]}</>}
        </div>
      ))}
      /> )}
    </div>
  )
}
