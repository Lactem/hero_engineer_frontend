import axios from "axios"
import apiBase from "./api"

export interface AllAvatarBodyZonesModel {
  [index: string]: AvatarBodyZoneModel
  "backs": AvatarBodyZoneModel
  "faceshape": AvatarBodyZoneModel
  "chinshadow": AvatarBodyZoneModel
  "facehighlight": AvatarBodyZoneModel
  "humanbody": AvatarBodyZoneModel
  "hair": AvatarBodyZoneModel
  "mustache": AvatarBodyZoneModel
  "beard": AvatarBodyZoneModel
  "eyesback": AvatarBodyZoneModel
  "eyesfront": AvatarBodyZoneModel
  "eyesiris": AvatarBodyZoneModel
  "eyebrows": AvatarBodyZoneModel
  "glasses": AvatarBodyZoneModel
  "mouth": AvatarBodyZoneModel
  "nose": AvatarBodyZoneModel
  "ears": AvatarBodyZoneModel
  "clothes": AvatarBodyZoneModel
}
export interface AvatarBodyZoneModel {
  scaleFactor: number
  block: "face" | "eyes" | "hair" | "clothes" | "backs"
  controls: string[]
  colors: string[]
  shapes: AvatarBodyZoneShapeModel[]
}
export interface AvatarBodyZoneShapeModel {
  [index: string]: AvatarBodyZoneUnlockInfoModel | AvatarBodyZoneShapeSegmentModel[] | undefined
  "unlockInfo"?: AvatarBodyZoneUnlockInfoModel
  "single"?: AvatarBodyZoneShapeSegmentModel[]
  "left"?: AvatarBodyZoneShapeSegmentModel[]
  "right"?: AvatarBodyZoneShapeSegmentModel[]
  "front"?: AvatarBodyZoneShapeSegmentModel[]
  "back"?: AvatarBodyZoneShapeSegmentModel[]
}
export interface AvatarBodyZoneShapeSegmentModel {
  path: string
  colored: boolean
  fill: "none" | "tone" | "hl05" | "hl1" | "hl2" | "sd05" | "sd1" | "sd2" | "sd3" | "sd35" | "gradient"
  stroke: "none" | "hl05" | "hl1" | "hl2" | "sd05" | "sd1" | "sd2" | "sd3" | "sd35"
  strokeWidth: "none" | number
  strokeLinecap?: number
  strokeLinejoin?: number
  strokeMiterlimit?: number
  opacity: number
  type?: "linear" | "radial"
  hideoncanvas?: boolean
  hideonthumbs?: boolean
  fromskin?: boolean
  gradientTransform?: string
  gradientUnits?: "userSpaceOnUse"
  gradientStops?: AvatarBodyZoneGradientStopModel[]
  x1?: number
  y1?: number
  x2?: number
  y2?: number
  cx?: number
  cy?: number
  fx?: number
  fy?: number
  r?: number
  irisx?: number
  irisy?: number
  hideears?: boolean
}
export interface AvatarBodyZoneUnlockInfoModel {
  defaultLocked: boolean
  lockedId: string
  unlockXpCost: number
  color: string
}
export interface AvatarBodyZoneGradientStopModel {
  offset: number
  color: "tone" | "hl05" | "hl1" | "hl2" | "sd05" | "sd1" | "sd2" | "sd3" | "sd35"
  opacity: number
}

export async function apiFetchAvatarsConfig() {
  const url = `${apiBase}/avatars/json/svgavatars-data`

  const { data } = await axios.get<AllAvatarBodyZonesModel>(url)
  return data
}
