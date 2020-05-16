import React, { useState } from "react"
import { useDispatch, useSelector } from "react-redux"

import { signUp } from "../../features/user/userSlice"
import { RootState } from "../../app/rootReducer"
import { loadHeroes } from "../../features/heroes/heroesSlice"

import { Button, Carousel, Form, Input, Layout, Space, Tag, Tooltip } from "antd"
import { useForm } from "antd/es/form/Form"
import { CheckCircleOutlined } from "@ant-design/icons"

import "./SignUp.css"
import { NavLink } from "react-router-dom"

export const SignUp = () => {
  const dispatch = useDispatch()
  const [form] = useForm()
  const [currentHero, setCurrentHero] = useState("")
  const { heroes, error }  = useSelector(
    (state: RootState) => state.heroes
  )
  const { userError }  = useSelector(
    (state: RootState) => state.user
  )

  if (heroes == null) {
    dispatch(loadHeroes())
  }

  /*

  function handleEmailChange(event: React.ChangeEvent<HTMLInputElement>) {
    setCurrentEmail(event.target.value)
  }

  function handleUsernameChange(event: React.ChangeEvent<HTMLInputElement>) {
    setCurrentUsername(event.target.value)
  }

  function handlePasswordChange(event: React.ChangeEvent<HTMLInputElement>) {
    setCurrentPassword(event.target.value)
  }
   */

  function handleHeroChange(newHero: string) {
    setCurrentHero(newHero)
  }

  function handleSubmit(values: any) {
    if (currentHero === "") {
      alert("No hero selected (please click one).")
    } else {
      const email = values.email.replace("@usc.edu", "")
      dispatch(signUp(email + "@usc.edu", values.username, values.password, currentHero))
    }
  }

  return (
    <>
      <NavLink to="/home">&lt;-- Home</NavLink>
      <Layout style={{ textAlign: "center" }}>
        <h1>Begin Your Journey</h1>
        <p>{error}</p>
        <p>{userError}</p>
        <p>Your Hero skills will be greatly needed. Please enter some information to get started.</p>

        <div style={{margin: "3%"}}>
          <Form
                form={form}
                layout="vertical"
                name="signUpForm"
                onFinish={handleSubmit}
          >
            <Form.Item
              label="USC email"
            >
              <Form.Item name="email"
                         rules={[
                           {
                             required: true,
                             message: "Please enter your @usc.edu email address.",
                           },
                         ]}
              >
                <Input placeholder="tommy.trojan" addonAfter="@usc.edu" />
              </Form.Item>
            </Form.Item>

            <Form.Item
              label="Username"
            >
              <Form.Item name="username"
                         rules={[
                           {
                             required: true,
                             message: "Please choose a username.",
                           },
                         ]}
              >
                <Input placeholder="hero_engineer123" />
              </Form.Item>
            </Form.Item>

            <Form.Item
              label="Password"
            >
              <Form.Item name="password"
                         rules={[
                           {
                             required: true,
                             message: "Please enter your password.",
                           },
                         ]}
              >
                <Input.Password placeholder="password" />
              </Form.Item>
            </Form.Item>

            <Form.Item label="Select a Hero"
                       rules={[
                         {
                           required: true,
                           message: "Please choose your Hero.",
                         },
                       ]}>
              <Carousel dots={{"className": "dots"}} dotPosition="left" autoplay={currentHero === ""}>
                {heroes && heroes.map((hero, i) => (
                  <div key={i}
                       onClick={() => handleHeroChange(hero.id)}
                  >
                    <Tooltip title="Click to select">
                      <div className={"hero"}
                           style={{padding: "2%", textAlign: "center", display: "flex", flexDirection: "column"}}
                      >
                        <div style={{alignSelf: "center"}}>
                          <img style={{width: "30%", marginLeft: "auto", marginRight: "auto"}}
                            alt="hero image"
                            src={"/" + hero.name + ".png"}
                          />
                        </div>
                        <h2 style={{display: "flex", justifyContent: "center"}}>
                          <span style={{height: "100%"}}>{hero.name}</span>
                          <span>{currentHero === hero.id &&
                          <Tag style={{marginLeft: "5px"}} color="success" icon={<CheckCircleOutlined />}>Selected</Tag>}
                          </span>
                        </h2>
                        {hero.desc}
                      </div>
                    </Tooltip>
                  </div>
                ))}
              </Carousel>
            </Form.Item>

            <Button type="primary" htmlType="submit">Sign Up</Button>
          </Form>
        </div>

        <Space>
          <br />
        </Space>
      </Layout>
    </>
  )
}
