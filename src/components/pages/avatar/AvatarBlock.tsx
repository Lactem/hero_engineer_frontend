import React from "react"

// A grouping of body zones. Ex: the "face" block is a grouping of the bodyzones: shape, highlight, mouth, nose, and ears
interface AvatarBlock {
  name: string
  active: boolean
  classes: string
  bodyZones: string
  onClick: Function
}
export const AvatarBlock = ({ name, active, classes, bodyZones, onClick }: AvatarBlock) => {
  return (
    <div
      id={`svga-blocks-${name}`}
      className={classes + (active ? " svga-active" : "")}
      data-blockname={name}
      data-bodyzones={bodyZones}
      onClick={(_) => onClick()}
    >
      {name}
    </div>
  )
}
