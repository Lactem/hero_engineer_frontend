import React, { useState } from "react"
import { NavLink } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../../app/rootReducer"
import { logIn } from "../../features/user/userSlice"
import { Form, Button, Input, Modal, Layout, Typography } from "antd"
import { useForm } from "antd/es/form/Form"
import history from "../../app/history"

export const Landing = () => {
  const dispatch = useDispatch()
  const [ form ] = useForm()
  const [modalVisible, setModalVisible] = useState(false)
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
    form.resetFields();
  }

  function signUp() {
    history.push("/sign-up")
  }

  // Logo URL: logomakr.com/6UaHmM
  return (
    <>
      <Layout className="container" style={{textAlign: "center", height: "100%"}}>
        <Typography.Title style={{fontSize: "50px"}}>Hero Engineer</Typography.Title>
        <p>Your hub for all things WRIT-340 with Professor Ramsey</p>

        <div style={{height: "50px"}} />
        <div style={{display: "inline-block"}}>
          <img src={"../../../hero_engineer_logo.png"}  alt="logo" width="200px" height="200px" />
        </div>
        <div style={{height: "50px"}} />

        <div>
          <Button style={{width: "auto"}} type="primary" onClick={signUp}>
            Start your journey (sign up)
          </Button>
          <br />or<br />
          <Button type="primary" onClick={showModal}>
            Log in
          </Button>
        </div>

        <div style={{height: "10px"}} />
      </Layout>
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
      </Modal>
    </>
  )
}