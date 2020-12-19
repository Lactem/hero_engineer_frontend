import React, { useState } from "react"
import { useDispatch, useSelector } from "react-redux"

import { RootState } from "../../app/rootReducer"
import { logOut } from "../../features/userSlice"
import history from "../../app/history"

import { Avatar, Card, Layout, message, Space, Tag, Tooltip } from "antd"
import { StarOutlined } from "@ant-design/icons"
import Meta from "antd/es/card/Meta"

import { UserOutlined } from "@ant-design/icons"
import { HeroCouncilIntro } from "./HeroCouncilIntro"
import { AvatarModal } from "./avatar/AvatarModal"

import "./Home.scss"

export const Home = () => {
  const dispatch = useDispatch()
  const [avatarModalVisible, setAvatarModalVisible] = useState(false)
  const [heroCouncilIntroVisible, setHeroCouncilIntroVisible] = useState(false)
  const { user } = useSelector(
    (state: RootState) => state.user
  )

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
      {user && <AvatarModal visible={avatarModalVisible} setVisible={setAvatarModalVisible} user={user} />}
      {user && <HeroCouncilIntro visible={heroCouncilIntroVisible} setVisible={setHeroCouncilIntroVisible} user={user} />}
      <div style={{ textAlign: "center" }}>
        <h1 className="title">
          <span style={{height: "100%", color: "red", marginRight: "10px"}}>Main</span>
          <span style={{height: "100%", color: "gold"}}>Menu</span>
        </h1>

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
                <div onClick={() => setAvatarModalVisible(true)}>
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
