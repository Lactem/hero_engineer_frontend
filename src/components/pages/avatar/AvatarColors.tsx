import React from "react"

import "./AvatarModal.scss"

// A collection of color options to style a body zone of the avatar
interface AvatarColors {
  colors: string[]
  bodyZone: string
  activeColor: string
  zoneActive: boolean
  onClick: Function
}
export const AvatarColors = ({
  colors,
  bodyZone,
  activeColor,
  zoneActive,
  onClick
}: AvatarColors) => {
  return (
    <div
      id={"svga-colors-" + bodyZone}
      key={"svga-colors-" + bodyZone}
      className={`svga-colors-set svga-elements-wrap-${zoneActive ? "display" : "hidden"}`}
    >
      {colors.map((color, i) => (
        <div
          key={"svga-colors-" + bodyZone + "-" + i}
          className={activeColor === color ? "svga-active" : ""}
          style={{ backgroundColor: color }}
          onClick={_ => onClick(color, i)}
        />
      ))}
      /> )}
    </div>
  )
}
