import React from "react"
import { useDispatch, useSelector } from "react-redux"

import { RootState } from "../../app/rootReducer"
import { logOut } from "../../features/user/userSlice"
import history from "../../app/history"

import { Card, Layout, Space, Tag } from "antd"
import { StarOutlined } from "@ant-design/icons"
import Meta from "antd/es/card/Meta"
import { createAvatar } from "../../api/doppelmeAPI"


export const Home = () => {
  const dispatch = useDispatch()
  const { user } = useSelector(
    (state: RootState) => state.user
  )

  function handleCreateAvatar() {
    createAvatar()
  }

  function handleQuests() {
    history.push("/quests")
  }

  function handleHeroCouncil() {
    alert("Coming soon")
  }

  function handleItemStore() {
    alert("Coming soon")
  }

  function handleLeaderboard() {
    alert("Coming soon")
  }

  function handleLeaveGame() {
    dispatch(logOut())
  }

  function handleAdminPanel() {
    history.push("/admin")
  }

  return (
    <>
      <Layout style={{ textAlign: "center" }}>
        <h1 style={{display: "flex", justifyContent: "center"}}>
          <span style={{height: "100%"}}>Welcome, {user && user.username}</span>
          <span>{user && (
              <Tag style={{marginLeft: "5px"}} icon={<StarOutlined />}>{user.xp} XP</Tag>
          )}</span>
        </h1>
        <button onClick={handleCreateAvatar}>Create Avatar</button>
        <Layout.Content>
          <Space direction="vertical" size="large" align="center">
            <Space direction="horizontal" size="large" align="center">
              <Card onClick={handleQuests}
                    hoverable bordered
                    cover={
                      <img
                        alt="example"
                        src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                      />
                    }
                    style={{ width: 300 }}>
                <Meta
                  title="Quests"
                  description="Earn XP and points by completing quests."
                />
              </Card>
            </Space>
            <Space direction="horizontal" size="large" align="center">
              <Card onClick={handleHeroCouncil}
                hoverable bordered
                cover={
                  <img
                    alt="example"
                    src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                  />
                }
                style={{ width: 300 }}>
                <Meta
                  title="Hero Council"
                  description="Every Hero needs allies."
                />
              </Card>
              <Card onClick={handleItemStore}
                    hoverable bordered
                    cover={
                      <img
                        alt="example"
                        src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                      />
                    }
                    style={{ width: 300 }}>
                <Meta
                  title="Item Store"
                  description="Use Hero Points to buy power-ups for you and your fellow Heroes."
                />
              </Card>
            </Space>
            <Space direction="horizontal" size="large" align="center">
              <Card onClick={handleLeaderboard}
                    hoverable bordered
                    cover={
                      <img
                        alt="example"
                        src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                      />
                    }
                    style={{ width: 300 }}>
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
                    src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                  />
                }
                style={{ width: 300 }}>
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
                          src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                        />
                      }
                      style={{ width: 300 }}>
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
      </Layout>
    </>
  )
}