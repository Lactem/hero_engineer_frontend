import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"

import { RootState } from "../../app/rootReducer"
import { loadProfile, logOut, updateAvatar } from "../../features/userSlice"
import history from "../../app/history"

import { Avatar, Card, Layout, message, Modal, Space, Tag, Tooltip } from "antd"
import { StarOutlined } from "@ant-design/icons"
import Meta from "antd/es/card/Meta"

import "./Home.scss"

import { initAvatars } from "../../avatars/js/svgavatars.core.min"
import { initTools } from "../../avatars/js/svgavatars.tools"
import { UserOutlined } from "@ant-design/icons"
import { AvatarDataColorsModel, AvatarDataFemaleModel, AvatarDataMaleModel, UserModel } from "../../api/userAPI"
import { HeroCouncilIntro } from "./HeroCouncilIntro"


export const Home = () => {
  const dispatch = useDispatch()
  const [avatarModalVisible, setAvatarModalVisible] = useState(false)
  const [heroCouncilIntroVisible, setHeroCouncilIntroVisible] = useState(false)
  const { user } = useSelector(
    (state: RootState) => state.user
  )

  function handleAvatar() {
    setAvatarModalVisible(true)
    setTimeout(() => {
      initTools(window)
      initAvatars(
        (user as UserModel).avatarDataMale,
        (user as UserModel).avatarDataFemale,
        (user as UserModel).avatarDataColors,
        saveAvatar,
        resetAvatar)
    }, 1)
  }

  function saveAvatar(svg: string,
                      dataMale: AvatarDataMaleModel | null,
                      dataFemale: AvatarDataFemaleModel | null,
                      colors: AvatarDataColorsModel | null,
                      successCallback: Function) {
    svg = svg.replace(/id="[a-z,-]*"/g, "")
    svg = svg.replace(/class="[a-z,-]*"/g, "")
    dispatch(updateAvatar(svg, dataMale, dataFemale, colors, () => {
      successCallback()
      setAvatarModalVisible(false)
    }))
  }

  function resetAvatar() {
    initAvatars(null, null, null, saveAvatar, resetAvatar)
  }

  function handleQuests() {
    history.push("/quests")
  }

  function handleLiveClassroom() {
    history.push("/live-classroom");
  }

  function handleHeroCouncil() {
    if (user) {
      if (user.grandChallengeCategory) history.push("/councils")
      else setHeroCouncilIntroVisible(true)
    }
  }

  function handleItemStore() {
    message.info('The Item Store is coming soon!');
  }

  function handleLeaderboard() {
    message.info('Leaderboards are coming soon!')
  }

  function handleLeaveGame() {
    dispatch(logOut())
    history.push("/")
  }

  function handleAdminPanel() {
    history.push("/admin")
  }

  return (
    <>
      {user && <HeroCouncilIntro visible={heroCouncilIntroVisible} setVisible={setHeroCouncilIntroVisible} user={user} />}
      <div style={{ textAlign: "center" }}>
        <h1 className="title">
          <span style={{height: "100%", color: "red", marginRight: "10px"}}>Main</span>
          <span style={{height: "100%", color: "gold"}}>Menu</span>
        </h1>
        <Modal visible={avatarModalVisible}
               centered={true}
               footer={null}
               width="50%"
               onCancel={() => setAvatarModalVisible(false)}
        >
          <div className="container">
            <div className="container2">
              <div className="container3">
                <div id="svgAvatars">
                  <div id="svga-container" className="svga-no-touch svga-light">
                    <div id="svga-canvas-wrap">
                      <canvas id="svga-canvas" width="200" height="200"></canvas>
                    </div>
                    <div className="svga-row">
                      <div className="svga-col-left">
                        <div className="svga-vert-order-glob-controls">
                          <div className="svga-row row-glob-controls">
                            <div className="scroll-wrapper scrollbar scroll-simple_outer" style={{position: "relative"}}>
                              <div id="svga-glob-controls" className="scrollbar scroll-simple_outer scroll-content"
                                   style={{height: "auto", marginBottom: "-16px", marginRight: "-16px", maxHeight: "56px"}}></div>
                              <div className="scroll-element scroll-x">
                                <div className="scroll-element_outer">
                                  <div className="scroll-element_size"></div>
                                  <div className="scroll-element_track"></div>
                                  <div className="scroll-bar" style={{width: "379px"}}></div>
                                </div>
                              </div>
                              <div className="scroll-element scroll-y">
                                <div className="scroll-element_outer">
                                  <div className="scroll-element_size"></div>
                                  <div className="scroll-element_track"></div>
                                  <div className="scroll-bar" style={{height: "40px"}}></div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="svga-vert-order-colors">
                          <div className="svga-row row-colors">
                            <div id="svga-custom-color"><input type="text" /></div>
                            <div id="svga-colors-wrap">
                              <div className="scroll-wrapper scrollbar scroll-simple_outer" style={{position: "relative"}}>
                                <div id="svga-colors" className="scrollbar scroll-simple_outer scroll-content"
                                     style={{height: "auto", marginBottom: "-16px", marginRight: "-16px", maxHeight: "56px"}}></div>
                                <div className="scroll-element scroll-x">
                                  <div className="scroll-element_outer">
                                    <div className="scroll-element_size"></div>
                                    <div className="scroll-element_track"></div>
                                    <div className="scroll-bar" style={{width: "379px"}}></div>
                                  </div>
                                </div>
                                <div className="scroll-element scroll-y">
                                  <div className="scroll-element_outer">
                                    <div className="scroll-element_size"></div>
                                    <div className="scroll-element_track"></div>
                                    <div className="scroll-bar" style={{height: "40px"}}></div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="svga-vert-order-svgcanvas">
                          <div className="svga-row row-svgcanvas">
                            <div id="svga-svgmain"></div>
                          </div>
                        </div>
                      </div>
                      <div className="svga-col-right">
                        <div className="svga-vert-order-controls">
                          <div className="svga-row row-controls">
                            <div className="scroll-wrapper scrollbar scroll-simple_outer" style={{position: "relative"}}>
                              <div id="svga-controls" className="scrollbar scroll-simple_outer scroll-content"
                                   style={{height: "auto", marginBottom: "-16px", marginRight: "-16px", maxHeight: "56px"}}></div>
                              <div className="scroll-element scroll-x">
                                <div className="scroll-element_outer">
                                  <div className="scroll-element_size"></div>
                                  <div className="scroll-element_track"></div>
                                  <div className="scroll-bar" style={{width: "490px"}}></div>
                                </div>
                              </div>
                              <div className="scroll-element scroll-y">
                                <div className="scroll-element_outer">
                                  <div className="scroll-element_size"></div>
                                  <div className="scroll-element_track"></div>
                                  <div className="scroll-bar" style={{height: "40px"}}></div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="svga-vert-order-main">
                          <div className="svga-android-hack">
                            <div className="svga-vert-order-elements">
                              <div className="svga-row row-elements">
                                <div className="scroll-wrapper scrollbar scroll-simple_outer" style={{position: "relative"}}>
                                  <div id="svga-elements" className="scrollbar scroll-simple_outer scroll-content"
                                       style={{height: "auto", marginBottom: "-16px", marginRight: "-16px", maxHeight: "56px"}}></div>
                                  <div className="scroll-element scroll-x">
                                    <div className="scroll-element_outer">
                                      <div className="scroll-element_size"></div>
                                      <div className="scroll-element_track"></div>
                                      <div className="scroll-bar" style={{width: "490px"}}></div>
                                    </div>
                                  </div>
                                  <div className="scroll-element scroll-y">
                                    <div className="scroll-element_outer">
                                      <div className="scroll-element_size"></div>
                                      <div className="scroll-element_track"></div>
                                      <div className="scroll-bar" style={{height: "40px"}}></div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="svga-vert-order-bodyzones">
                              <div className="svga-row row-bodyzones">
                                <div id="svga-bodyzones"></div>
                              </div>
                            </div>
                            <div className="svga-vert-order-blocks">
                              <div className="svga-row">
                                <div className="scroll-wrapper scrollbar scroll-simple_outer" style={{position: "relative"}}>
                                  <div id="svga-blocks" className="scrollbar scroll-simple_outer scroll-content"
                                       style={{height: "66px", marginBottom: "-16px", marginRight: "-16px", maxHeight: "none"}}></div>
                                  <div className="scroll-element scroll-x">
                                    <div className="scroll-element_outer">
                                      <div className="scroll-element_size"></div>
                                      <div className="scroll-element_track"></div>
                                      <div className="scroll-bar" style={{width: "490px"}}></div>
                                    </div>
                                  </div>
                                  <div className="scroll-element scroll-y">
                                    <div className="scroll-element_outer">
                                      <div className="scroll-element_size"></div>
                                      <div className="scroll-element_track"></div>
                                      <div className="scroll-bar" style={{height: "72px"}}></div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="svga-row">
                          <div id="svga-footermenu">
                            <ul>
                              <li id="svga-randomavatar">
                                <div></div>
                                <span className="svga-mobilehidden">Random</span></li>
                              <li id="svga-resetavatar">
                                <div></div>
                                <span className="svga-mobilehidden">Reset</span></li>
                              <li id="svga-downloadavatar">
                                <div></div>
                                <span className="svga-mobilehidden">Save</span>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div id="svga-start-overlay">&nbsp;</div>
                    <div id="svga-work-overlay">&nbsp;</div>
                    <div id="svga-loader"><p>Loading...</p></div>
                    <div id="svga-gender"><h2>Create Your Avatar</h2>
                      <div id="svga-starticons-wrap">
                        <div id="svga-start-boys">
                          <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="80px" height="80px" viewBox="0 0 80 80">
                            <path className="svga-icon-boy"
                                  d="M73.22,72.6c-1.05-6.99-8.49-9.28-14.35-10.97c-3.07-0.89-6.98-1.58-9.48-3.72C47.3,56.13,47.5,50.9,49,49.8c3.27-2.39,5.26-7.51,6.14-11.25c0.25-1.07-0.36-0.46,0.81-0.64c0.71-0.11,2.13-2.3,2.64-3.21c1.02-1.83,2.41-4.85,2.42-8.02c0.01-2.23-1.09-2.51-2.41-2.29c-0.43,0.07-0.93,0.21-0.93,0.21c1.42-1.84,1.71-8.22-0.67-13.4C53.56,3.71,44.38,2,40,2c-2.35,0-7.61,1.63-7.81,3.31c-3.37,0.19-7.7,2.55-9.2,5.89c-2.41,5.38-1.48,11.4-0.68,13.4c0,0-0.5-0.14-0.93-0.21c-1.32-0.21-2.42,0.07-2.41,2.29c0.01,3.16,1.41,6.19,2.43,8.02c0.51,0.91,1.93,3.1,2.64,3.21c1.17,0.18,0.56-0.42,0.81,0.64c0.89,3.74,3.09,9.03,6.14,11.25c1.69,2.04,1.7,6.33-0.39,8.11c-2.84,2.43-7.37,3.07-10.84,4.12c-5.86,1.77-13.29,4.9-13.27,12.25C6.51,76.73,7.7,78,10.13,78h59.74c2.43,0,3.68-1.27,3.63-3.72C73.5,74.28,73.4,73.81,73.22,72.6C72.63,68.73,73.4,73.81,73.22,72.6z"></path>
                          </svg>
                        </div>
                        <div id="svga-start-girls">
                          <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="80px" height="80px" viewBox="0 0 80 80">
                            <path className="svga-icon-girl"
                                  d="M71,74.56c-0.08-5.44-4.21-7.67-8.81-9.63c-3.65-1.55-12.07-2.23-13.83-6.23c-0.83-1.89-0.22-3.15,0.11-5.85c6.95,0.23,17.72-5.29,19.02-10.4c0.65-2.55-2.79-4.44-4.22-6.01c-1.86-2.04-3.3-4.5-4.29-7.07c-2.17-5.61-0.2-11.18-2.14-16.7C54.18,5.14,46.53,2.01,40,2.01l0,0c0,0,0,0,0,0s0,0,0,0l0,0c-6.53,0-14.18,3.13-16.83,10.66c-1.94,5.51,0.03,11.09-2.14,16.7c-0.99,2.57-2.44,5.03-4.29,7.07c-1.43,1.58-4.87,3.46-4.22,6.01c1.3,5.1,12.07,10.62,19.02,10.4c0.34,2.7,0.94,3.95,0.11,5.85c-1.75,3.99-10.18,4.67-13.83,6.23c-4.6,1.96-8.74,4.2-8.81,9.63c-0.04,2.79-0.04,3.43,3.49,3.43H67.5C71.04,77.99,71.04,77.35,71,74.56z"></path>
                          </svg>
                        </div>
                      </div>
                      <p>Select a body type</p></div>
                    <div id="svga-dialog"><h3>Are you sure?</h3><p>The all current changes will be lost.</p>
                      <div id="svga-dialog-btns">
                        <div id="svga-dialog-ok">ok</div>
                        <div id="svga-dialog-cancel">cancel</div>
                      </div>
                    </div>
                    <div id="svga-message">
                      <div id="svga-message-text"></div>
                      <div className="svga-close">close</div>
                    </div>
                    <div id="svga-ios">
                      <div id="svga-ios-text"><p>Please tap and hold the image and choose Save</p></div>
                      <div id="svga-ios-image"></div>
                      <div className="svga-close">close</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal>

        <Layout.Content>
          <Space direction="vertical" size="large" align="center">
            <Space direction="horizontal" size="large" align="center">
              <Card onClick={handleQuests}
                    hoverable bordered
                    cover={
                      <img
                        alt="example"
                        src="../../../Quests.png"
                      />
                    }
                    className="card__quests">
                <Meta
                  title="Quests"
                  description="Earn XP and points by completing quests."
                />
              </Card>

              <Card onClick={handleLiveClassroom}
                    hoverable bordered
                    cover={
                      <img
                        alt="example"
                        src="../../../Live_Classroom.jpg"
                      />
                    }
                    className="card__live-classroom">
                <Meta
                  title="Live Classroom"
                  description="Complete in-class assignments."
                />
              </Card>

              <Card onClick={handleHeroCouncil}
                    hoverable bordered
                    cover={
                      <img
                        alt="example"
                        src="../../../Hero Council.png"
                      />
                    }
                    className="card__hero-council">
                <Meta
                  title="Hero Council"
                  description="Every Hero needs allies."
                />
              </Card>
            </Space>
            <Space className="card__profile">
              {user && (
                <div onClick={handleAvatar}>
                  <Tooltip title="Edit Avatar">
                    <Avatar size={75} icon={user.avatarSVG
                      ? <span dangerouslySetInnerHTML={{__html: user.avatarSVG}} />
                      : <UserOutlined />}
                    />
                  </Tooltip>
                </div>
              )}

              <span>{user && (<>
              {user.username}
                <Tag style={{marginLeft: "5px"}} icon={<StarOutlined />}>{user.xp} XP</Tag>
              </>
              )}</span>
            </Space>
            <Space direction="horizontal" size="large" align="center">
              <Card onClick={handleItemStore}
                    hoverable bordered
                    cover={
                      <img
                        alt="example"
                        src="../../../Item Store.png"
                      />
                    }
                    className="card__item-store">
                <Meta
                  title="Item Store"
                  description="Use Hero Points to buy power-ups for you and your fellow Heroes."
                />
              </Card>
              <Card onClick={handleLeaderboard}
                    hoverable bordered
                    cover={
                      <img
                        alt="example"
                        src="../../../Leaderboard.png"
                      />
                    }
                    className="card__leaderboard">
                <Meta
                  title="Leaderboard"
                  description="View the latest rankings."
                />
              </Card>
              <Card onClick={handleLeaveGame}
                    hoverable bordered
                    cover={
                      <img
                        alt="example"
                        src="../../../Leave Game.png"
                      />
                    }
                    className="card__logout">
                <Meta
                  title="Leave Game"
                  description="Sign out."
                />
              </Card>
            </Space>
            <Space direction="horizontal" size="large" align="center">
              {user && user.isProf && (
                <Card onClick={handleAdminPanel}
                      hoverable bordered
                      cover={
                        <img
                          alt="example"
                          src="../../../Admin Panel.png"
                        />
                      }
                      className="card__admin-panel">
                  <Meta
                    title="Admin Panel"
                    description="Modify the game."
                  />
                </Card>
              )}
            </Space>
            <br />
          </Space>
        </Layout.Content>
      </div>
    </>
  )
}
