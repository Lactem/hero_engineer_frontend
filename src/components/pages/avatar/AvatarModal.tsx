import { message, Modal } from "antd"
import React, { useEffect, useRef, useState } from "react"
import * as SVG from "svg.js"
import { TinyColor } from "@ctrl/tinycolor"

import {
  AvatarDataColorsModel,
  AvatarDataModel,
  UserModel
} from "../../../api/userAPI"
import {
  AllAvatarBodyZonesModel,
  AvatarBodyZoneShapeModel,
  AvatarBodyZoneShapeSegmentModel
} from "../../../api/avatarsAPI"
import { updateAvatar, updateUnlockedAvatarOptions } from "../../../features/userSlice"
import { initAvatars } from "../../../avatars/js/svgavatars.core"
import { useDispatch, useSelector } from "react-redux"
import { initTools } from "../../../avatars/js/svgavatars.tools"
import { AvatarCanvas } from "./AvatarCanvas"
import { AvatarBlock } from "./AvatarBlock"
import { loadAvatarsConfig } from "../../../features/avatarsSlice"
import { RootState } from "../../../app/rootReducer"
import { AvatarBodyZone } from "./AvatarBodyZone"
import { AvatarBodyZoneElement } from "./AvatarBodyZoneElement"

import "./AvatarModal.scss"
import { AvatarColors } from "./AvatarColors"
import { G } from "svg.js"

interface AvatarModalProps {
  visible: boolean
  setVisible: any
  user: UserModel
}
export const AvatarModal = ({
  visible,
  setVisible,
  user
}: AvatarModalProps) => {
  const dispatch = useDispatch()

  // Constant values
  const blockNames: string[] = ["face", "eyes", "hair", "clothes", "backs"]
  const bodyZonesPerBlock: { [index: string]: string } = {
    "backs": "backs",
    "face": "faceshape,nose,mouth,ears",
    "eyes": "eyesfront,eyesiris,eyebrows,glasses",
    "hair": "hair,mustache,beard",
    "clothes": "clothes"
  }
  const bodyZoneTitles: { [index: string]: string } = {
    backs: "backgrounds",
    faceshape: "shape",
    chinshadow: "", // not displayed, just for compatibility
    facehighlight: "", // not displayed, just for compatibility
    humanbody: "", // not displayed, just for compatibility
    clothes: "outfits",
    hair: "on head",
    ears: "ears",
    eyebrows: "eyebrows",
    eyesback: "", // not displayed, just for compatibility
    eyesiris: "iris",
    eyesfront: "eye shape",
    mouth: "mouth",
    nose: "nose",
    glasses: "glasses",
    mustache: "mustache",
    beard: "beard"
  }
  const initialBodyPartColorMappings: AvatarDataColorsModel = {
    "backs": "#ecf0f1",
    "skin": "#f0c7b1",
    "clothes": "#386e77",
    "hair": "#2a232b",
    "eyebrows": "#2a232b",
    "eyesback": "#000000",
    "eyesfront": "#000000",
    "eyesiris": "#4e60a3",
    "glasses": "#26120B",
    "mustache": "#2a232b",
    "beard": "#2a232b",
    "mouth": "#da7c87"
  }
  // The step of saturation color change in HSV (HSB) mode (10% by default)
  const saturationDelta = 0.1

  // The step of value (brightness) color change in HSV (HSB) mode (6% by default)
  const brightnessDelta = 0.06

  // Initialization values
  const initialized = useRef(false)
  const { avatarsConfig, avatarsConfigLoading } = useSelector(
    (state: RootState) => state.avatars
  )

  // State for body blocks and zones
  const [activeBlock, setActiveBlock] = useState("")
  const [activeBodyZone, setActiveBodyZone] = useState("faceshape")
  const [selectedElements, setSelectedElements] = useState({} as AvatarDataModel)
  const [colorChanging, setColorChanging] = useState(false)
  const [maleType, setMaleType] = useState(false)
  const [faceshapeShapes, setFaceshapeShapes] = useState([] as AvatarBodyZoneShapeModel[])
  const [chinshadowShapes, setChinshadowShapes] = useState([] as AvatarBodyZoneShapeModel[])
  const [updatedConfig, setUpdatedConfig] = useState({} as AllAvatarBodyZonesModel)

  const [bodyPartColorMappings, setBodyPartColorMappings] = useState(initialBodyPartColorMappings)

  // Current action being asked about in the sub-modal -- either "reset" to reset the avatar or "random" to pick a random avatar
  const [subModalAction, setSubModalAction] = useState('')

  // Visual (fade-in and fade-out) effects
  const [visualBlurOverlayState, setVisualBlurOverlayState] = useState('hidden')
  const [visualBlurOverlayStateTimeout, setVisualBlurOverlayStateTimeout] = useState({} as NodeJS.Timeout)
  const [visualDialogModalState, setVisualDialogModalState] = useState('hidden')
  const [visualDialogModalStateTimeout, setVisualDialogModalStateTimeout] = useState({} as NodeJS.Timeout)

  // SVG containers and elements
  const [mainCanvas, setMainCanvas] = useState({} as SVG.Container)

  // Run initialization only once on component render
  useEffect(() => {
    if (!avatarsConfig) {
      if (!avatarsConfigLoading) {
        dispatch(loadAvatarsConfig())
      }
      return
    }

    if (visible && !initialized.current) {
      setUpdatedConfig(avatarsConfig)
      initialized.current = true
      setTimeout(() => {
        initTools(window)

        /*
        let shapeIndex: number
        let bodyZones = "backs faceshape chinshadow facehighlight humanbody clothes hair ears eyebrows eyesback eyesiris eyesfront glasses mouth mustache beard nose".split(" ")
        for (let i = shapeIndex = 0; i < bodyZones.length; i++) {
          if ("backs" === bodyZones[i] || "hair" === bodyZones[i]) shapeIndex = 1
          for (let segmentOfShape in avatarsConfig[bodyZones[i]].shapes[shapeIndex]) {
            let bodyZone, blocks
            if (avatarsConfig[bodyZones[i]].shapes[shapeIndex].hasOwnProperty(segmentOfShape)) {
              bodyZone = "svga-group-" + bodyZones[i] + "-" + segmentOfShape;
              (window as any).jQuery("#" + bodyZone).empty()
              blocks = SVG.get(bodyZone)
              drawBodyPartOnCanvas(blocks as SVG.Container, bodyZones[i], shapeIndex, segmentOfShape, true)
            }
          }
          selectedElements[bodyZones[i]] = shapeIndex
          shapeIndex = 0
        }*/

        initAvatars(
          user.avatarData,
          user.avatarDataColors,
          user.avatarUnlockedBodyZoneShapes,
          user.xp,
          onClickLockedShape,
          saveAvatar,
          SVG,
          color,
          colorsSet
        )

        initElements()
        initZones(user.avatarData)
        initColors(user.avatarDataColors)
        setMaleType(true)
        setMaleType(false)
        setMaleType(user.avatarData ? user.avatarData["clothes"] < 10 : true)
        setTimeout(() => {
          if (!user.avatarData) {
            resetAvatar()
          }
        }, 1)
      }, 10)
    }
  }, [visible, avatarsConfigLoading])

  // Redraw avatar body zones when a new color is selected for a zone
  const usePrevious = (value: AvatarDataColorsModel): AvatarDataColorsModel | undefined => {
    const ref = useRef<AvatarDataColorsModel>()
    useEffect(() => {
      ref.current = value
    })
    return ref.current
  }
  const previousBodyPartColorMappings: AvatarDataColorsModel | undefined = usePrevious(bodyPartColorMappings)
  useEffect(() => {
    if (!previousBodyPartColorMappings) return
    for (let bodyZone of Object.keys(bodyPartColorMappings)) {
      if (bodyPartColorMappings[bodyZone] !== previousBodyPartColorMappings[bodyZone]) {
        console.log(bodyPartColorMappings)
        if (bodyZone === "skin") {
          let bodyZonesToColor = "faceshape humanbody chinshadow facehighlight ears nose eyesfront".split(" ")
          for (let i = 0; i < bodyZonesToColor.length; i++) {
            color([bodyZonesToColor[i]], bodyPartColorMappings[bodyZone])
          }
        } else {
          color([bodyZone], bodyPartColorMappings[bodyZone])
        }
      }
    }
    setColorChanging(false)
  }, [bodyPartColorMappings])

  // Keep faceshape aligned with clothing/bodytype
  const usePreviousFace = (value: boolean): boolean | undefined => {
    const ref = useRef<boolean>()
    useEffect(() => {
      ref.current = value
    })
    return ref.current
  }
  const previousMaleType: boolean | undefined = usePreviousFace(false)
  useEffect(() => {
    if (previousMaleType === undefined || !avatarsConfig) return
      setUpdatedConfig({ ...avatarsConfig,
        "faceshape": { ...avatarsConfig["faceshape"], shapes: avatarsConfig["faceshape"].shapes.slice(maleType ? 0 : 15, maleType ? 15 : 30) },
        "chinshadow": { ...avatarsConfig["chinshadow"], shapes: avatarsConfig["chinshadow"].shapes.slice(maleType ? 0 : 15, maleType ? 15 : 30) }
      })
      onClickElement("faceshape", selectedElements["faceshape"])
  }, [maleType])

  function initZones(initialBody: AvatarDataModel) {
    console.log("zones init")
    /*for (let bodyZone in initialBody) {
      if (bodyZone === "humanbody" || bodyZone === "clothes") continue
      (window as any).jQuery("#svga-elements-" + bodyZone + "-" + initialBody[bodyZone]).trigger("click")
    }
    // Changing clothes also changes humanbody, so we just set clothes (and in effect humanbody as well) at the end)
    if (initialBody) {
      (window as any).jQuery("#svga-elements-clothes-" + initialBody["clothes"]).trigger("click")
    }*/

    if (!avatarsConfig) return
    if (!initialBody) {
      resetAvatar()
      return
    }

    let bodyZones = "backs faceshape chinshadow facehighlight humanbody clothes hair ears eyebrows eyesback eyesiris eyesfront glasses mouth mustache beard nose".split(" ")
    for (let i = 0; i < bodyZones.length; i++) {
      for (let segmentOfShape in avatarsConfig[bodyZones[i]].shapes[initialBody[bodyZones[i]]]) {
        let bodyZone
        if (avatarsConfig[bodyZones[i]].shapes[initialBody[bodyZones[i]]].hasOwnProperty(segmentOfShape) && segmentOfShape !== "unlockInfo") {
          bodyZone = "svga-group-" + bodyZones[i] + "-" + segmentOfShape;
          (window as any).jQuery("#" + bodyZone).empty();
          (window as any).jQuery("#svga-elements-" + bodyZones[i] + "-" + initialBody[bodyZones[i]]).addClass("svga-active-element")
          drawBodyPartOnCanvas(bodyZones[i], initialBody[bodyZones[i]], segmentOfShape, true)
        }
      }
      selectedElements[bodyZones[i]] = initialBody[bodyZones[i]]
    }
  }

  function initColors(colors: AvatarDataColorsModel) {
    setColorChanging(true)
    setBodyPartColorMappings({ ...colors })
  }

  function initElements() {
    if (!avatarsConfig) return

    for (let bodyZone in avatarsConfig) {
      if (!avatarsConfig.hasOwnProperty(bodyZone)) continue;
      let bodyZoneScaleFactor = avatarsConfig[bodyZone].scaleFactor
      let bodyZoneColors = avatarsConfig[bodyZone].colors
      //a("#svga-elements").append(
      //  '<div id="svga-elements-' + bodyZone + '"></div>'
      //)
      for (let i = 0; i < avatarsConfig[bodyZone].shapes.length; i++) {
        console.log(bodyZone + i)
        if ((bodyZone === "faceshape" || bodyZone === "chinshadow") && i > 14) break
        (window as any).jQuery("#svga-elements-" + bodyZone).show();
        (window as any).jQuery("#svga-colors-" + bodyZone).show()
        // @ts-ignore
        let svgElement = SVG("svga-elements-" + bodyZone + "-" + i)
          .size("100%", "100%")
          .attr({
            id: "svga-svgcanvas-elements-" + bodyZone + "-" + i,
            width: null,
            height: null,
            class: "svga-svg",
            viewBox: "0 0 200 200",
            preserveAspectRatio: "xMinYMin meet"
          })
          .group()
          .attr({
            id: "svga-svgcanvas-elements-" + bodyZone + "-" + i + "-g"
          })
        var shapeIndex = i
        for (let segmentOfShape in avatarsConfig[bodyZone].shapes[shapeIndex]) {
          if (!avatarsConfig[bodyZone].shapes[shapeIndex].hasOwnProperty(segmentOfShape)) continue;
          if ("right" !== segmentOfShape &&
            "single" !== segmentOfShape &&
            "back" !== segmentOfShape &&
            "front" !== segmentOfShape) continue;

          // @ts-ignore
          if (avatarsConfig[bodyZone].shapes[shapeIndex][segmentOfShape].length) {
            drawBodyPartOnCanvas(bodyZone, shapeIndex, segmentOfShape, false)
            const bbox = svgElement.bbox()
            svgElement
              .transform({ scale: bodyZoneScaleFactor })
              .transform({ x: -bbox.x * bodyZoneScaleFactor + (200 - bbox.width * bodyZoneScaleFactor) / 2 })
              .transform({ y: -bbox.y * bodyZoneScaleFactor + (200 - bbox.height * bodyZoneScaleFactor) / 2 })
            if ("clothes" === bodyZone) {
              svgElement.move(10, 5)
            }
            if ("hair" === bodyZone && 0 < shapeIndex) {
              svgElement.move(0, 20)
            }
          } else {
            (window as any).jQuery("#svga-elements-" + bodyZone + "-" + i)
              .empty()
              .append("<div></div>")
              .addClass("empty")
          }
        }
      }
      (window as any).jQuery("#svga-elements-" + bodyZone).hide();
      /*a("#svga-colors").append(
        '<div id="svga-colors-' + bodyZone + '" class="svga-colors-set"></div>'
      )
      for (let i = 0; i < bodyZoneColors.length; i++)
        a("#svga-colors-" + bodyZone).append("<div></div>"),
          a("#svga-colors-" + bodyZone + " div:last-child").css(
            "background-color",
            bodyZoneColors[i]
          )
       */
        (window as any).jQuery("#svga-colors-" + bodyZone).hide()
    }
  }

  function onClickLockedShape(unlockCost: number, id: string) {
    if (user.xp >= unlockCost) {
      message.success("Background unlocked!")
      const unlockedAvatarOptions = user.avatarUnlockedBodyZoneShapes ? [...user.avatarUnlockedBodyZoneShapes, id] : [id]
      dispatch(updateUnlockedAvatarOptions(unlockedAvatarOptions, () => {}))
      return true
    } else {
      message.info("You need " + (unlockCost - user.xp) + " more XP to unlock this background.")
      return false
    }
  }

  function saveAvatar(
    svg: string,
    data: AvatarDataModel | null,
    colors: AvatarDataColorsModel | null,
    successCallback: Function
  ) {
    svg = svg.replace(/id="[a-z,-]*"/g, "")
    svg = svg.replace(/className="[a-z,-]*"/g, "")
    dispatch(
      updateAvatar(svg, data, colors, () => {
        successCallback()
        setVisible(false)
      })
    )
  }

  function setDataAttributesForMoving(node: SVG.Element) {
    let attributes = ["updown", "leftright", "rotate"];
    for (let i = 0; i < attributes.length; i++) {
      node.data(attributes[i], 0)
    }
    node.attr("transform", "matrix(1,0,0,1,0,0)")
  }

  function setDataAttributesForScaling(node: SVG.Element) {
    let attributes = ["scaleX", "scaleY"];
    for (let i = 0; i < attributes.length; i++) {
      node.data(attributes[i], 1)
    }
    node.attr("transform", "matrix(1,0,0,1,0,0)")
  }

  function resetAvatar() {
    SVG.get("svga-group-wrapper").node.remove()

    // @ts-ignore
    let e: Container = SVG("svga-svgcanvas").attr({
      id: "svga-svgcanvas",
      width: null,
      height: null,
      class: "svga-svg",
      viewBox: "0 0 200 200",
      preserveAspectRatio: "xMinYMin meet"
    })
    setMainCanvas(e)

    // @ts-ignore
    e = e.group().attr("id", "svga-group-wrapper")
    e.group().attr("id", "svga-group-backs-single")
    // @ts-ignore
    e = e.group().attr("id", "svga-group-humanwrap-move")
    // @ts-ignore
    setDataAttributesForMoving(e)
    // @ts-ignore
    e = e.group().attr("id", "svga-group-humanwrap")
    // @ts-ignore
    setDataAttributesForScaling(e)
    var d = e.group().attr("id", "svga-group-hair-back-move")
    // @ts-ignore
    setDataAttributesForMoving(d)
    d = d.group().attr("id", "svga-group-hair-back")
    // @ts-ignore
    setDataAttributesForScaling(d)
    e.group().attr("id", "svga-group-humanbody-single")
    e.group().attr("id", "svga-group-chinshadow-single")
    e.group().attr("id", "svga-group-clothes-single")
    var f = e.group().attr("id", "svga-group-head")
    // @ts-ignore
    setDataAttributesForMoving(f)
    d = e.group().attr("id", "svga-group-ears-left-move")
    // @ts-ignore
    setDataAttributesForMoving(d)
    f.add(d)
    d = d.group().attr("id", "svga-group-ears-left")
    // @ts-ignore
    setDataAttributesForScaling(d)
    d = e.group().attr("id", "svga-group-ears-right-move")
    // @ts-ignore
    setDataAttributesForMoving(d)
    f.add(d)
    d = d.group().attr("id", "svga-group-ears-right")
    // @ts-ignore
    setDataAttributesForScaling(d)
    d = e.group().attr("id", "svga-group-faceshape-wrap")
    // @ts-ignore
    setDataAttributesForScaling(d)
    f.add(d)
    d.group().attr("id", "svga-group-faceshape-single")
    d = e.group().attr("id", "svga-group-mouth-single-move")
    // @ts-ignore
    setDataAttributesForMoving(d)
    f.add(d)
    d = d.group().attr("id", "svga-group-mouth-single")
    // @ts-ignore
    setDataAttributesForScaling(d)
    d = e.group().attr("id", "svga-group-eyes-left-move")
    // @ts-ignore
    setDataAttributesForMoving(d)
    f.add(d)
    d = d.group().attr("id", "svga-group-eyes-left")
    // @ts-ignore
    setDataAttributesForScaling(d)
    d.group().attr("id", "svga-group-eyesback-left")
    var h = d.group().attr("id", "svga-group-eyesiriswrapper-left")
    h = h.group().attr("id", "svga-group-eyesiriscontrol-left")
    // @ts-ignore
    setDataAttributesForMoving(h)
    h = h.group().attr("id", "svga-group-eyesiris-left")
    // @ts-ignore
    setDataAttributesForScaling(h)
    d.group().attr("id", "svga-group-eyesfront-left")
    d = e.group().attr("id", "svga-group-eyes-right-move")
    // @ts-ignore
    setDataAttributesForMoving(d)
    f.add(d)
    d = d.group().attr("id", "svga-group-eyes-right")
    // @ts-ignore
    setDataAttributesForScaling(d)
    d.group().attr("id", "svga-group-eyesback-right")
    h = d.group().attr("id", "svga-group-eyesiriswrapper-right")
    h = h.group().attr("id", "svga-group-eyesiriscontrol-right")
    // @ts-ignore
    setDataAttributesForMoving(h)
    h = h.group().attr("id", "svga-group-eyesiris-right")
    // @ts-ignore
    setDataAttributesForScaling(h)
    d.group().attr("id", "svga-group-eyesfront-right")
    f.group().attr("id", "svga-group-facehighlight-single")
    d = f.group().attr("id", "svga-group-eyebrows-left-move")
    // @ts-ignore
    setDataAttributesForMoving(d)
    d = d.group().attr("id", "svga-group-eyebrows-left-rotate")
    // @ts-ignore
    setDataAttributesForMoving(d)
    d = d.group().attr("id", "svga-group-eyebrows-left")
    // @ts-ignore
    setDataAttributesForScaling(d)
    d = f.group().attr("id", "svga-group-eyebrows-right-move")
    // @ts-ignore
    setDataAttributesForMoving(d)
    d = d.group().attr("id", "svga-group-eyebrows-right-rotate")
    // @ts-ignore
    setDataAttributesForMoving(d)
    d = d.group().attr("id", "svga-group-eyebrows-right")
    // @ts-ignore
    setDataAttributesForScaling(d)
    d = f.group().attr("id", "svga-group-nose-single-move")
    // @ts-ignore
    setDataAttributesForMoving(d)
    d = d.group().attr("id", "svga-group-nose-single")
    // @ts-ignore
    setDataAttributesForScaling(d)
    d = f.group().attr("id", "svga-group-beardwrap")
    // @ts-ignore
    setDataAttributesForScaling(d)
    d = d.group().attr("id", "svga-group-beard-single-move")
    // @ts-ignore
    setDataAttributesForMoving(d)
    d = d.group().attr("id", "svga-group-beard-single")
    // @ts-ignore
    setDataAttributesForScaling(d)
    d = f.group().attr("id", "svga-group-mustache-single-move")
    // @ts-ignore
    setDataAttributesForMoving(d)
    d = d.group().attr("id", "svga-group-mustache-single")
    // @ts-ignore
    setDataAttributesForScaling(d)
    d = f.group().attr("id", "svga-group-hair-front")
    // @ts-ignore
    setDataAttributesForScaling(d)
    d = f.group().attr("id", "svga-group-glasses-single-move")
    // @ts-ignore
    setDataAttributesForMoving(d)
    d = d.group().attr("id", "svga-group-glasses-single")
    // @ts-ignore
    setDataAttributesForScaling(d)

    for (let bodyZone in avatarsConfig) {
      if (bodyZone === "unlockInfo") continue
      const shapeIndex = bodyZone === "hair" ? 1 : 0;
      (window as any).jQuery("#svga-elements-" + bodyZone + "-" + shapeIndex).trigger("click");
    }
    (window as any).jQuery("#svga-blocks-face").trigger("click");

    setBodyPartColorMappings(initialBodyPartColorMappings)
  }

  function randomAvatar() {
    if (!avatarsConfig) return
    resetAvatar()

    let mustache = false, beard = false

    if (randomNumber(0, 1) === 0) {
      mustache = true
      beard = false
    } else if (randomNumber(0, 1) === 0) {
      mustache = false
      beard = true
    } else if (randomNumber(0, 3) === 0) {
      mustache = true
      beard = true
    }
    let hairColor = randomNumber(0, 19)
    let skinColor = randomNumber(0, 19)
    let skinColorHex = avatarsConfig["faceshape"].colors[skinColor]
    let bodyPartColorMappingsCopy = { ...bodyPartColorMappings }

    for (let bodyZone in avatarsConfig) {
      let bodyZoneOption = 0
      let color = randomNumber(0, 19)
      switch (bodyZone) {
        case "ears":
          bodyZoneOption = randomNumber(0, 6)
          break
        case "eyesfront":
          bodyZoneOption = randomNumber(0, 29)
          break
        case "eyesiris":
          bodyZoneOption = randomNumber(0, 7)
          break
        case "hair":
          bodyZoneOption = randomNumber(0, 29)
          break
        case "mustache":
          if (mustache) bodyZoneOption = randomNumber(1, 12)
          break
        case "beard":
          if (beard) bodyZoneOption = randomNumber(1, 12)
          break
        case "glasses":
          if (randomNumber(0, 2) === 0) bodyZoneOption = randomNumber(0, 17)
          break
        case "clothes":
          bodyZoneOption = randomNumber(0, 24)
          break
        case "backs":
          bodyZoneOption = randomNumber(0, 4)
          break
        default:
          bodyZoneOption = randomNumber(0, 14)
      }
      if (bodyZoneOption > 0) {
        (window as any).jQuery("#svga-elements-" + bodyZone + "-" + bodyZoneOption).trigger("click");
        if ("hair" === bodyZone ||
          "mustache" === bodyZone ||
          "beard" === bodyZone ||
          "eyebrows" === bodyZone) {
          bodyPartColorMappingsCopy = { ...bodyPartColorMappingsCopy, [bodyZone]: avatarsConfig[bodyZone].colors[hairColor] }
        } else if (bodyZone === "faceshape" ||
          bodyZone === "humanbody" ||
          bodyZone === "chinshadow" ||
          bodyZone === "facehighlight" ||
          bodyZone === "ears" ||
          bodyZone === "nose" ||
          bodyZone === "backs"
        ) {
        } else if (bodyZone === "eyesfront") {
          bodyPartColorMappingsCopy = { ...bodyPartColorMappingsCopy, [bodyZone]: skinColorHex };
        }
        else {
          bodyPartColorMappingsCopy = { ...bodyPartColorMappingsCopy, [bodyZone]: avatarsConfig[bodyZone].colors[color] };
        }
      }
    }
    (window as any).jQuery("#svga-blocks-face").trigger("click");
    (window as any).jQuery("#svga-bodyzones-faceshape").trigger("click");

    bodyPartColorMappingsCopy = { ...bodyPartColorMappingsCopy, "skin": skinColorHex }
    setBodyPartColorMappings({ ...bodyPartColorMappingsCopy });
  }

  /**
   * onClick functions
   */

  function onClickCancel() {
    fadeOutBlurOverlay()
    fadeOutDialogModal()
  }

  function onClickOk() {
    fadeOutBlurOverlay()
    fadeOutDialogModal()

    if (subModalAction === "reset") resetAvatar()
    else if (subModalAction === "random") randomAvatar()
  }

  function onClickReset() {
    setSubModalAction("reset")
    fadeInBlurOverlay()
    fadeInDialogModal()
  }

  function onClickRandom() {
    setSubModalAction("random")
    fadeInBlurOverlay()
    fadeInDialogModal()
  }

  function onClickBlock(block: string) {
    setActiveBlock(block)
  }

  function onClickBodyZone(bodyZone: string) {
    setActiveBodyZone(bodyZone)
  }

  function onClickElement(bodyZone: string, shape: number) {
    if (!avatarsConfig) return;
    const jQuerySelector = (window as any).jQuery("#svga-elements-" + bodyZone + "-" + shape)
    // @ts-ignore
    const unlockInfo = avatarsConfig[bodyZone].shapes[shape].unlockInfo

    if (unlockInfo) {
      if (unlockInfo.defaultLocked && (!user.avatarUnlockedBodyZoneShapes || user.avatarUnlockedBodyZoneShapes.indexOf(unlockInfo.lockedId) < 0)) {
        if (onClickLockedShape(unlockInfo.unlockXpCost, unlockInfo.lockedId)) {
          jQuerySelector.find(".svga-element-locked-unlockable-overlay").remove()
        }
        return
      } else if (unlockInfo.color && bodyZone === "backs") {
        (window as any).jQuery("#svga-group-backs-single").empty()
        drawBodyPartOnCanvas("backs", shape, "single", true)
        jQuerySelector.siblings().removeClass("svga-active-element")
        jQuerySelector.addClass("svga-active-element")
        selectedElements["backs"] = shape
        colorsSet(unlockInfo.color, 1)
      }
    }

    // Match humanbody 0 ("male") to clothing shapes 0-9 and human body 1 ("female") to clothing shapes 10-24
    if (bodyZone === "clothes") {
      onClickElement("humanbody", shape < 10 ? 0 : 1)
      setMaleType(shape < 10)
    }

    let bodyZoneArray =
      "eyesfront" === bodyZone
        ? ["eyesback", "eyesfront"]
        : "faceshape" === bodyZone
        ? ["faceshape", "chinshadow"]
        : [bodyZone]
    for (let i = 0; i < bodyZoneArray.length; i++) {
      (window as any).jQuery("#svga-custom-color > input").spectrum("set", bodyPartColorMappings[bodyZoneArray[i]])
      //shapeIndex = "facehighlight" === bodyZone[i] || "humanbody" === bodyZone[i] ? 0 : jQuerySelectorData.shape
      for (let segmentOfShape in avatarsConfig[bodyZoneArray[i]].shapes[shape]) {
        if (avatarsConfig[bodyZoneArray[i]].shapes[shape].hasOwnProperty(segmentOfShape)) {
          (window as any).jQuery("#svga-group-" + bodyZoneArray[i] + "-" + segmentOfShape).empty()
          drawBodyPartOnCanvas(bodyZoneArray[i], (bodyZoneArray[i] === "faceshape" || bodyZoneArray[i] === "chinshadow") && !maleType ? shape + 15 : shape, segmentOfShape, true)
        }
      }

      jQuerySelector.siblings().removeClass("svga-active-element")
      jQuerySelector.addClass("svga-active-element")
      selectedElements[bodyZoneArray[i]] = shape
    }
  }

  function onClickSave() {
    const svg = (window as any).jQuery("#svga-svgmain").html()
    saveAvatar(svg, selectedElements, bodyPartColorMappings, () => {})
  }

  /**
   * Utility functions
   */

  function fadeOutBlurOverlay() {
    clearTimeout(visualBlurOverlayStateTimeout)
    setVisualBlurOverlayState('fading-out')
    setVisualBlurOverlayStateTimeout(setTimeout(() => {
      setVisualBlurOverlayState('hidden')
    }, 200))
  }

  function fadeInBlurOverlay() {
    clearTimeout(visualBlurOverlayStateTimeout)
    setVisualBlurOverlayState('fading-in')
    setVisualBlurOverlayStateTimeout(setTimeout(() => {
      setVisualBlurOverlayState('visible')
    }, 1))
  }

  function fadeOutDialogModal() {
    clearTimeout(visualDialogModalStateTimeout)
    setVisualDialogModalState('fading-out')
    setVisualDialogModalStateTimeout(setTimeout(() => {
      setVisualDialogModalState('hidden')
    }, 200))
  }

  function fadeInDialogModal() {
    clearTimeout(visualDialogModalStateTimeout)
    setVisualDialogModalState('fading-in')
    setVisualDialogModalStateTimeout(setTimeout(() => {
      setVisualDialogModalState('visible')
    }, 1))
  }

  function drawBodyPartOnCanvas(bodyZone: string, shapeIndex: number, segmentOfShape: string, onCanvas: boolean) {
    while (onCanvas && colorChanging) {}

    // @ts-ignore
    const unlockInfo = avatarsConfig[bodyZone].shapes[shapeIndex].unlockInfo
    let defaultColor: string
    if (unlockInfo && unlockInfo.color) {
      defaultColor = unlockInfo.color
    } else if (bodyZone === "faceshape" ||
      bodyZone === "humanbody" ||
      bodyZone === "chinshadow" ||
      bodyZone === "facehighlight" ||
      bodyZone === "ears" ||
      bodyZone === "nose") {
      defaultColor = bodyPartColorMappings["skin"]
    } else {
      defaultColor = bodyPartColorMappings[bodyZone]
    }
    drawBodyPartOnCanvasWithColor(bodyZone, shapeIndex, segmentOfShape, onCanvas, defaultColor)
  }

  // segmentOfShape is "single," "left," "right," "front," or "back"
  function drawBodyPartOnCanvasWithColor(bodyZone: string, shapeIndex: number, segmentOfShape: string, onCanvas: boolean, defaultColor: string) {
    while (onCanvas && colorChanging) {}
    if (!avatarsConfig || segmentOfShape === "unlockInfo") return

    const node: G = SVG.get(onCanvas ? ("svga-group-" + bodyZone + "-" + segmentOfShape) : ("svga-svgcanvas-elements-" + bodyZone + "-" + shapeIndex + "-g")) as G
    let segmentOfShapeObject = avatarsConfig[bodyZone].shapes[shapeIndex][segmentOfShape]
    let segmentProperty: AvatarBodyZoneShapeSegmentModel
    let doSomethingWithGradientStops = function(gradient: SVG.Gradient) {
      // TODO: Fix this
      // @ts-ignore
      for (let i = 0; i < segmentProperty.gradientStops.length; i++) {
        // TODO: Fix this (above ts-ignore might resolve this, too)
        // @ts-ignore
        let stopType = segmentProperty.gradientStops[i].color
        let color = getColor(stopType, segmentProperty.fromskin ? "faceshape" : bodyZone, true, onCanvas ? "bodyZone" : defaultColor)
        if ('at' in gradient) {
          // TODO: Fix this (above ts-ignore might resolve this, too)
          // @ts-ignore
          let stop: SVG.Stop = gradient.at(segmentProperty.gradientStops[i])
          stop.update({ color: color })
          stop.data("stoptype", stopType)
        }
      }
    }

    // TODO: Fix this (above ts-ignore might resolve this, too)
    // @ts-ignore
    for (let i = 0; i < segmentOfShapeObject.length; i++) {
      if (!segmentOfShapeObject) continue
      // TODO: Fix this (above ts-ignore might resolve this, too)
      // @ts-ignore
      segmentProperty = segmentOfShapeObject[i]
      const path = node.path(segmentProperty.path)
      path.data("colored", segmentProperty.colored, true)
      path.data("fillType", segmentProperty.fill)
      path.data("strokeType", segmentProperty.stroke)
      if (segmentProperty.fromskin) path.data("fromskin", segmentProperty.fromskin, true)
      if (path.data("colored") === true) {
        var h: any = segmentProperty.fromskin ? "faceshape" : bodyZone
        var l = path.data("fillType")
        l = getColor(l, h, false, onCanvas ? "bodyZone" : defaultColor)
        path.attr("fill", l)
        l = path.data("strokeType")
        h = getColor(l, h, false, onCanvas ? "bodyZone" : defaultColor)
        path.stroke(h)
        path.attr({
          stroke: h,
          "stroke-width": segmentProperty.strokeWidth,
          "stroke-linecap": segmentProperty.strokeLinecap,
          "stroke-linejoin": segmentProperty.strokeLinejoin,
          "stroke-miterlimit": segmentProperty.strokeMiterlimit
        })
      } else {
        if ("gradient" === segmentProperty.fill) {
          if (onCanvas) {
            V("svga-on-canvas-" + bodyZone + "-gradient-" + segmentOfShape + "-" + i)
          } else if (h = document.getElementById("svga-" + bodyZone + "-gradient-" + segmentOfShape + "-" + shapeIndex + "-" + i)) {
            h.parentNode.removeChild(h)
          }
          // @ts-ignore
          h = node.gradient(segmentProperty.type as string, doSomethingWithGradientStops)
          if (segmentProperty.x1) h.attr({ x1: segmentProperty.x1 })
          if (segmentProperty.y1) h.attr({ y1: segmentProperty.y1 })
          if (segmentProperty.x2) h.attr({ x2: segmentProperty.x2 })
          if (segmentProperty.y2) h.attr({ y2: segmentProperty.y2 })
          if (segmentProperty.cx) h.attr({ cx: segmentProperty.cx })
          if (segmentProperty.cy) h.attr({ cy: segmentProperty.cy })
          if (segmentProperty.fx) h.attr({ fx: segmentProperty.fx })
          if (segmentProperty.fy) h.attr({ fy: segmentProperty.fy })
          if (segmentProperty.r) h.attr({ r: segmentProperty.r })
          if (segmentProperty.gradientTransform) h.attr({ gradientTransform: segmentProperty.gradientTransform })
          if (segmentProperty.gradientUnits) h.attr({ gradientUnits: segmentProperty.gradientUnits })
          if (onCanvas) h.attr("class", "svga-on-canvas-" + bodyZone + "-gradient-" + segmentOfShape + "-" + i)
          else h.attr("id", "svga-" + bodyZone + "-gradient-" + segmentOfShape + "-" + shapeIndex + "-" + i)
          path.attr({ fill: h })
        } else {
          path.attr({ fill: segmentProperty.fill })
          path.attr({
            stroke: segmentProperty.stroke,
            "stroke-width": segmentProperty.strokeWidth,
            "stroke-linecap": segmentProperty.strokeLinecap,
            "stroke-linejoin": segmentProperty.strokeLinejoin,
            "stroke-miterlimit": segmentProperty.strokeMiterlimit
          })
        }
      }
      if (segmentProperty.opacity) path.attr({ opacity: segmentProperty.opacity })
      if (onCanvas) {
        if ("eyesback" === bodyZone) SVG.get("svga-group-eyesiriswrapper-" + segmentOfShape).transform({x: 0, y: 0 })
        if (segmentProperty.irisx && segmentProperty.irisy) SVG.get("svga-group-eyesiriswrapper-" + segmentOfShape).move(segmentProperty.irisx, segmentProperty.irisy)
        if ("hair" === bodyZone) {
          if (segmentProperty.hideears)  {
            SVG.get("svga-group-ears-left-move").hide()
            SVG.get("svga-group-ears-right-move").hide()
          } else {
            SVG.get("svga-group-ears-left-move").show()
            SVG.get("svga-group-ears-right-move").show()
          }
        }
      }
      if (!onCanvas && segmentProperty.hideonthumbs) path.remove()
      else if (onCanvas && segmentProperty.hideoncanvas) path.remove()
    }
  }

  function V(a: any) {
    a = (window as any).jQuery
    for (a = document.getElementsByClassName(a); 0 < a.length;)
      a[0].parentNode.removeChild(a[0])
  }

  function randomNumber(start: number, end: number): number {
    return Math.floor(Math.random() * (end - start + 1)) + start
  }

  function getColor(a: string, bodyZone: string, e: boolean, defaultColor: string) {
    if (bodyZone === "faceshape" ||
      bodyZone === "humanbody" ||
      bodyZone === "chinshadow" ||
      bodyZone === "facehighlight" ||
      bodyZone === "ears" ||
      bodyZone === "nose") {
      bodyZone = "skin"
    }

    let returnColor: string
    let baseColor = defaultColor === "bodyZone" ? bodyPartColorMappings[bodyZone] : defaultColor

    switch (a) {
      case "none":
        returnColor = "none"
        break
      case "tone":
        returnColor = baseColor
        break
      case "hl05":
        returnColor = addSaturationAndBrightness(baseColor, -0.5 * saturationDelta, 0.5 * brightnessDelta)
        break
      case "hl1":
        returnColor = addSaturationAndBrightness(baseColor, -saturationDelta, brightnessDelta)
        break
      case "hl2":
        returnColor = addSaturationAndBrightness(baseColor, -2 * saturationDelta, 2 * brightnessDelta)
        break
      case "sd05":
        returnColor = addSaturationAndBrightness(baseColor, 0.5 * saturationDelta, -0.5 * brightnessDelta)
        break
      case "sd1":
        returnColor = addSaturationAndBrightness(baseColor, saturationDelta, -brightnessDelta)
        break
      case "sd2":
        returnColor = addSaturationAndBrightness(baseColor, 2 * saturationDelta, -2 * brightnessDelta)
        break
      case "sd3":
        returnColor = addSaturationAndBrightness(baseColor, 3 * saturationDelta, -3 * brightnessDelta)
        break
      case "sd35":
        returnColor = addSaturationAndBrightness(baseColor, 3.5 * saturationDelta, -3.5 * brightnessDelta)
        break
      default:
        returnColor = baseColor
        if (e) returnColor = a
    }
    return returnColor
  }


  function addSaturationAndBrightness(hexColor: string, saturation: number, brightness: number) {
    let hsv = new TinyColor(hexColor).toHsv()
    hsv.s += saturation
    if (hsv.s < 0) hsv.s = 0
    if (hsv.s > 1) hsv.s = 1
    hsv.v += brightness
    if (hsv.v < 0) hsv.v = 0
    if (hsv.v > 1) hsv.v = 1
    return new TinyColor(hsv).toHexString()
  }

  function color(bodyZonesToColor: string[], colorHex: string) {
    if (!avatarsConfig) return

    let numBodyZonesToColor = bodyZonesToColor.length
    let i: number
    let f = function(_: any, __: any) {
      // @ts-ignore
      if (this.data("colored")) {
        // @ts-ignore
        let bodyZone = this.data("fromskin") === true ? "faceshape" : bodyZonesToColor[i]
        // @ts-ignore
        let fillType = this.data("fillType")
        let color = getColor(fillType, bodyZone, false, "bodyZone")
        // @ts-ignore
        this.attr("fill", color)
        // @ts-ignore
        let strokeType = this.data("strokeType")
        color = getColor(strokeType, bodyZone, false, "bodyZone")
        // @ts-ignore
        this.stroke(color)
      } else {
        // @ts-ignore
        if (this.data("fillType") === "gradient") {
          // @ts-ignore
          let svgQuery = this.attr("fill")
          svgQuery = svgQuery.replace(/url\(#/, "").replace(/\)/, "")
          let svgs = SVG.get(svgQuery)
          if (svgs) {
            // @ts-ignore
            let bodyZone = this.data("fromskin") === true ? "faceshape" : bodyZonesToColor[i]
            // @ts-ignore
            svgs.each(function(_: any, __: any) {
              // @ts-ignore
              let stopType = this.data("stoptype")
              let color = getColor(stopType, bodyZone, true, "bodyZone")
              // @ts-ignore
              this.update({ color: color })
            })
          }
        }
      }
    }

    for (i = 0; i < numBodyZonesToColor; i++) {
      if (numBodyZonesToColor > 1 && bodyZonesToColor[i] !== "mouth" && bodyZonesToColor[i] !== "eyesfront") {
        //setBodyPartColorMappings({...bodyPartColorMappings, [bodyZonesToColor[i]]: colorHex})
      } else {
        //setBodyPartColorMappings({...bodyPartColorMappings, [activeBodyZone]: colorHex})
      }
      //let selectedShape = "facehighlight" === bodyZonesToColor[i] || "humanbody" === bodyZonesToColor[i] ? 0 : selectedAvatarElements[bodyZonesToColor[i]]
      let selectedShape = selectedElements[bodyZonesToColor[i]]
      for (let segmentOfShape in avatarsConfig[bodyZonesToColor[i]].shapes[selectedShape])
        if (avatarsConfig[bodyZonesToColor[i]].shapes[selectedShape].hasOwnProperty(segmentOfShape) && segmentOfShape !== "unlockInfo") {
          let svgs = SVG.get("svga-group-" + bodyZonesToColor[i] + "-" + segmentOfShape)
          // @ts-ignore
          svgs.each(f)
        }
    }
  }

  //function colorsSet(jQuerySelector: any) {
  function colorsSet(bgColor: string, clickedNChild: number) {
    console.log("active zone: " + activeBodyZone)
    /*
    jQuerySelector.siblings().removeClass("svga-active")
    jQuerySelector.addClass("svga-active")

    // Find n for use in nth-child so that we can call the div's click function when we reload
    var clickedNChild = -1
    var i = 0
    for (var i = 0; i < jQuerySelector.siblings().length; i++) {
      if (jQuerySelector.siblings()[i] === jQuerySelector[0].nextSibling) {
        clickedNChild = i + 1
      }
    }
    if (clickedNChild === -1) clickedNChild = i + 1
    */
    // Ears, nose, and faceshape all share the same color
    if (activeBodyZone === "faceshape" || activeBodyZone === "nose" || activeBodyZone === "ears") {
      //colors["faceshape"] = clickedNChild
      //colors["nose"] = clickedNChild
      //colors["ears"] = clickedNChild
    } else {
      //colors[activeBodyZone] = clickedNChild
    }

    //let bgColor = jQuerySelector.css("background-color")
    //bgColor = new TinyColor(bgColor).toHexString();
    (window as any).jQuery("#svga-custom-color > input").spectrum("set", bgColor)
    let bodyZonesToColor: string[]
    switch (activeBodyZone) {
      case "faceshape":
        //bodyZonesToColor = "faceshape humanbody chinshadow facehighlight ears nose eyesfront".split(" ")
        bodyZonesToColor = ["skin"]
        break
      case "ears":
        //bodyZonesToColor = "faceshape humanbody chinshadow facehighlight ears nose eyesfront".split(" ")
        bodyZonesToColor = ["skin"]
        break
      case "nose":
        //bodyZonesToColor = "faceshape humanbody chinshadow facehighlight ears nose eyesfront".split(" ")
        bodyZonesToColor = ["skin"]
        break
      default:
        bodyZonesToColor = [activeBodyZone]
        break
    }
    let bodyPartColorMappingsCopy = { ...bodyPartColorMappings }
    for (let i = 0; i < bodyZonesToColor.length; i++) {
      bodyPartColorMappingsCopy = { ...bodyPartColorMappingsCopy, [bodyZonesToColor[i]]: bgColor }
    }
    setBodyPartColorMappings({ ...bodyPartColorMappingsCopy })
  }

  return (
    <Modal
      visible={visible}
      onCancel={() => setVisible(false)}
      centered={true}
      footer={null}
      width="50%"
    >
      <div className="svga-container1">
        <div className="svga-container2">
          <div className="svga-container3">
            <div id="svgAvatars">
              <div id="svga-container" className="svga-no-touch svga-boys">
                <div id="svga-canvas-wrap">
                  <canvas id="svga-canvas" />
                </div>
                <div className="svga-row">
                  <div className="svga-col-left">
                    <div className="svga-vert-order-glob-controls">
                      <div className="svga-row row-glob-controls">
                        <div
                          id="svga-glob-controls"
                          className="scrollbar scroll-simple_outer" />
                      </div>
                    </div>
                    <div className="svga-vert-order-colors">
                      <div className="svga-row row-colors">
                        <div id="svga-custom-color">
                          <input type="text" />
                        </div>
                        <div id="svga-colors-wrap">
                          <div
                            id="svga-colors"
                            className="scrollbar scroll-simple_outer"
                          >
                            {avatarsConfig && Object.keys(avatarsConfig).map(bodyZone =>
                              bodyZone === "backs" ? <></> :
                              <AvatarColors
                                colors={avatarsConfig[bodyZone].colors}
                                bodyZone={bodyZone}
                                activeColor={bodyZone === "faceshape" ||
                                bodyZone === "humanbody" ||
                                bodyZone === "chinshadow" ||
                                bodyZone === "facehighlight" ||
                                bodyZone === "ears" ||
                                bodyZone === "nose" ? bodyPartColorMappings["skin"] : bodyPartColorMappings[bodyZone]}
                                zoneActive={bodyZoneTitles[bodyZone] ? activeBodyZone === bodyZone : false}
                                onClick={colorsSet}
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <AvatarCanvas />
                  </div>

                  <div className="svga-col-right">
                    <div className="svga-vert-order-controls">
                      <div className="svga-row row-controls">
                        <div
                          id="svga-controls"
                          className="scrollbar scroll-simple_outer" />
                      </div>
                    </div>
                    <div className="svga-vert-order-main">
                      <div className="svga-android-hack">
                        <div className="svga-vert-order-elements">
                          <div className="svga-row row-elements">
                            <div
                              id="svga-elements"
                              className="scrollbar scroll-simple_outer">
                              {avatarsConfig && Object.keys(avatarsConfig).map(bodyZone =>
                                <AvatarBodyZoneElement
                                  config={updatedConfig[bodyZone]}
                                  name={bodyZone}
                                  active={activeBodyZone === bodyZone}
                                  zoneActive={bodyZoneTitles[bodyZone] ? activeBodyZone === bodyZone : false}
                                  onClick={onClickElement}
                                  user={user}
                                />
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="svga-vert-order-bodyzones">
                          <div className="svga-row row-bodyzones">
                            <div id="svga-bodyzones">
                              {avatarsConfig && Object.keys(avatarsConfig).map(bodyZone =>
                                <AvatarBodyZone
                                  config={avatarsConfig[bodyZone]}
                                  name={bodyZone}
                                  title={bodyZoneTitles[bodyZone]}
                                  active={activeBodyZone === bodyZone}
                                  blockActive={bodyZoneTitles[bodyZone] ? activeBlock === avatarsConfig[bodyZone].block : false}
                                  onClick={() => onClickBodyZone(bodyZone)}
                                />
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="svga-vert-order-blocks">
                          <div className="svga-row">
                            <div
                              id="svga-blocks"
                              className="scrollbar scroll-simple_outer">
                              {blockNames.map((blockName, i) => (
                                <AvatarBlock
                                  key={blockName}
                                  name={blockName}
                                  active={activeBlock === blockName}
                                  classes={"svga-blocks" + (i === blockNames.length - 1 ? " svga-last" : "")}
                                  bodyZones={bodyZonesPerBlock[blockName]}
                                  onClick={() => onClickBlock(blockName)}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="svga-row">
                      <div id="svga-footermenu">
                        <ul>
                          <li id="svga-randomavatar" onClick={onClickRandom}>
                            <div />
                            <span className="svga-mobilehidden">
                              random
                            </span>
                          </li>
                          <li id="svga-resetavatar" onClick={onClickReset}>
                            <div />
                            <span className="svga-mobilehidden">
                              reset
                            </span>
                          </li>
                          <li id="svga-saveavatar" onClick={onClickSave}>
                            <div />
                            <span className="svga-mobilehidden">
                              save
                            </span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                <div id="svga-start-overlay">&nbsp;</div>
                <div id="svga-work-overlay" className={`svga-work-overlay__${visualBlurOverlayState}`}>&nbsp;</div>
                <div id="svga-loader">Loading...</div>
                <div id="svga-dialog" className={`svga-dialog__${visualDialogModalState}`}>
                  <h3>Are you sure?</h3><p>All current changes will be lost.</p>
                  <div id="svga-dialog-btns">
                    <div id="svga-dialog-ok" onClick={onClickOk}>OK</div>
                    <div id="svga-dialog-cancel" onClick={onClickCancel}>Cancel</div>
                  </div>
                </div>
                <div id="svga-ios">
                  <div id="svga-ios-text"><p>Tap and hold the image and choose Save</p></div>
                  <div id="svga-ios-image" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  )
}
