import React, { useState } from "react"
import { NavLink } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../../app/rootReducer"
import { logIn, loginFailedAction, setPassword } from "../../features/userSlice"
import { Form, Button, Input, Modal } from "antd"
import { useForm } from "antd/es/form/Form"
import history from "../../app/history"

import "./Landing.css"

export const Landing = () => {
  const dispatch = useDispatch()
  const [form] = useForm()
  const [setPassForm] = useForm()
  const [modalVisible, setModalVisible] = useState(false)
  const [resetPassModalVisible, setResetPassModalVisible] = useState(false)
  const { userError, loginLoading } = useSelector(
    (state: RootState) => state.user
  )

  function showModal() {
    setModalVisible(true)
  }

  function handleLoginSubmit() {
    form
      .validateFields()
      .then(values => {
        const email = values.email.replace("@usc.edu", "")
        dispatch(logIn(email + "@usc.edu", values.password));
      })
      .catch(info => {
        console.log('Validate Failed:', info);
      });
  }

  function handleCancel() {
    setModalVisible(false)
    setResetPassModalVisible(false)
    form.resetFields()
    setPassForm.resetFields()
    dispatch(loginFailedAction(""))
  }

  function handleSetPassSubmit() {
    setPassForm
      .validateFields()
      .then(values => {
        const email = values.email.replace("@usc.edu", "")
        dispatch(setPassword(email + "@usc.edu", values.password));
      })
      .catch(info => {
        console.log('Validate Failed:', info);
      });
  }

  function signUp() {
    dispatch(loginFailedAction(""))
    history.push("/sign-up")
  }

  function onClickReset() {
    handleCancel()
    setResetPassModalVisible(false)
  }

  // Logo URL: https://logomakr.com/93uFCv
  return (
    <>
      <div id="landing-cover" />
      <div style={{textAlign: "center", height: "100%", width: "100%", zIndex: 1}}>
        <div style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", width: "100%", height: "100%"}}>
          <div style={{marginTop: "5%"}} />
          <div style={{WebkitFilter: "drop-shadow(0 0 3px white)", filter: "drop-shadow(0 0 3px white)", width: "25%", height: "100%"}}>
            <img src={"/hero_engineer_logo.png"}  alt="logo" width="100%" height="100%" />
          </div>
          <div style={{marginTop: "2%"}} />

          <div id="button-container">
            <Button size="large" type="primary" onClick={signUp}>
              Start your journey (sign up)
            </Button>
            <Button size="large" type="primary" onClick={showModal}>
              Log in
            </Button>
          </div>
        </div>
      </div>
      <Modal style={{textAlign: "center"}}
             title="Log in"
             visible={modalVisible}
             onOk={handleLoginSubmit}
             okText="Log in"
             confirmLoading={loginLoading}
             onCancel={handleCancel}
             footer={null}
      >
        {userError && <div style={{color: "red"}}>{userError}</div>}
        <Form
          layout="vertical"
          form={form}
          name="basic"
        >
          <Form.Item
            label="USC email"
            name="email"
            rules={[
              {
                required: true,
                message: "Please enter your @usc.edu email address.",
              },
            ]}
          >
            <Input placeholder="tommy.trojan" addonAfter="@usc.edu" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              {
                required: true,
                message: "Please enter your password.",
              },
            ]}
          >
            <Input.Password placeholder="password" />
          </Form.Item>
          <Button onClick={handleLoginSubmit} type="primary" htmlType="submit" style={{width: "100%"}}>
            Log in
          </Button>
        </Form>
        Don't have an account?
        <NavLink to="/sign-up"> Sign Up!</NavLink>
        <br />
        Forgot Password?
        <span onClick={onClickReset}> <a>Reset</a></span>
      </Modal>

      <Modal style={{textAlign: "center"}}
             title="Set New Password"
             visible={resetPassModalVisible}
             onOk={handleSetPassSubmit}
             okText="Reset Password"
             onCancel={handleCancel}
             footer={null}
      >
        {userError && <div style={{color: "red"}}>{userError}</div>}
        <Form
          layout="vertical"
          form={setPassForm}
          name="basic"
        >
          <Form.Item
            label="USC email"
            name="email"
            rules={[
              {
                required: true,
                message: "Please enter your @usc.edu email address.",
              },
            ]}
          >
            <Input placeholder="tommy.trojan" addonAfter="@usc.edu" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              {
                required: true,
                message: "Please enter your password.",
              },
            ]}
          >
            <Input.Password placeholder="password" />
          </Form.Item>
          <Button onClick={handleSetPassSubmit} type="primary" htmlType="submit" style={{width: "100%"}}>
            Set Password
          </Button>
        </Form>
      </Modal>
    </>
  )
}