import { message, Modal } from "antd"
import React, { useEffect, useRef, useState } from "react"

import "./AvatarModal.scss"
import {
  AvatarDataColorsModel,
  AvatarDataModel,
  UserModel
} from "../../../api/userAPI"
import { updateAvatar } from "../../../features/userSlice"
import { initAvatars } from "../../../avatars/js/svgavatars.core"
import { useDispatch } from "react-redux"
import { initTools } from "../../../avatars/js/svgavatars.tools"

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
  const initialized = useRef(false)
  const [blurOverlayState, setBlurOverlayState] = useState('hidden')
  const [blurOverlayStateTimeout, setBlurOverlayStateTimeout] = useState({} as NodeJS.Timeout)

  // Run initialization only once on component render
  useEffect(() => {
    if (visible && !initialized.current) {
      initialized.current = true
      setTimeout(() => {
        initTools(window)
        initAvatars(
          user.avatarData,
          user.avatarDataColors,
          user.avatarUnlockedBodyZoneShapes,
          user.xp,
          onClickLockedShape,
          saveAvatar,
          resetAvatar
        )
      }, 1)
    }
  }, [visible])

  function onClickLockedShape(unlockCost: number, zone: string, shape: string) {
    const xp = user.xp
    if (xp >= unlockCost) {
      message.success(
        "Successfully unlocked avatar option (-" + unlockCost + " XP)!"
      )
      return true
    } else {
      message.info("That avatar option costs " + unlockCost + " XP.")
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

  function resetAvatar() {
    initAvatars(
      null,
      null,
      user.avatarUnlockedBodyZoneShapes,
      user.xp,
      onClickLockedShape,
      saveAvatar,
      resetAvatar
    )
  }

  /**
   * onClick functions
   */
  function onClickCancel() {
    clearTimeout(blurOverlayStateTimeout)
    setBlurOverlayState('fading-out')
    setBlurOverlayStateTimeout(setTimeout(() => {
      setBlurOverlayState('hidden')
    }, 1))
  }

  function onClickReset() {
      clearTimeout(blurOverlayStateTimeout)
      setBlurOverlayState('fading-in')
      setBlurOverlayStateTimeout(setTimeout(() => {
        setBlurOverlayState('visible')
      }, 1))
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
              <div id="svga-container" className="svga-no-touch">
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
                            className="scrollbar scroll-simple_outer" />
                        </div>
                      </div>
                    </div>
                    <div className="svga-vert-order-svgcanvas">
                      <div className="svga-row row-svgcanvas">
                        <div id="svga-svgmain" />
                      </div>
                    </div>
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
                              className="scrollbar scroll-simple_outer" />
                          </div>
                        </div>
                        <div className="svga-vert-order-bodyzones">
                          <div className="svga-row row-bodyzones">
                            <div id="svga-bodyzones" />
                          </div>
                        </div>
                        <div className="svga-vert-order-blocks">
                          <div className="svga-row">
                            <div
                              id="svga-blocks"
                              className="scrollbar scroll-simple_outer" />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="svga-row">
                      <div id="svga-footermenu">
                        <ul>
                          <li id="svga-randomavatar">
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
                          <li id="svga-saveavatar">
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
                <div id="svga-work-overlay" className={`svga-work-overlay__${blurOverlayState}`}>&nbsp;</div>
                <div id="svga-loader">Loading...</div>
                <div id="svga-dialog">
                  <h3>Are you sure?</h3><p>All current changes will be lost.</p>
                  <div id="svga-dialog-btns">
                    <div id="svga-dialog-ok">OK</div>
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
