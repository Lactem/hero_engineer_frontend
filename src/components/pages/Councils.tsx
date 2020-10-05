import React, { useEffect, useState } from "react"

import { Avatar, Button, Comment, Empty, Form, Input, message, Select, Upload } from "antd"

import { useDispatch, useSelector } from "react-redux"
import { UserModel } from "../../api/userAPI"
import { RootState } from "../../app/rootReducer"
import { InboxOutlined, RedoOutlined, RollbackOutlined, UserOutlined } from "@ant-design/icons/lib"
import { HeroCouncilIntro } from "./HeroCouncilIntro"
import { loadClassmates } from "../../features/sectionSlice"

import "./Councils.scss"
import { useForm } from "antd/lib/form/Form"
import { UploadChangeParam } from "antd/lib/upload"
import apiBase from "../../api/api"
import axios from "axios"
import { loadHeroCouncil, saveHeroCouncil } from "../../features/heroCouncilSlice"
import { HeroCouncilModel } from "../../api/heroCouncilAPI"
import { loadProfessorAvatar } from "../../features/userSlice"

export const Councils = () => {
  const dispatch = useDispatch()
  const [heroCouncilIntroVisible, setHeroCouncilIntroVisible] = useState(false)
  const [categoryClassmates, setCategoryClassmates] = useState([] as UserModel[])
  const { user, professorAvatar } = useSelector(
    (state: RootState) => state.user
  )
  const { heroCouncil } = useSelector(
    (state: RootState) => state.heroCouncil
  )
  const { classmates } = useSelector(
    (state: RootState) => state.section
  )
  useEffect(() => {
    const timer = setInterval(() => {
      dispatch(loadHeroCouncil())
    }, 1000);
    return () => clearTimeout(timer);
  })
  if (!classmates) dispatch(loadClassmates())
  if (!professorAvatar) dispatch(loadProfessorAvatar())

  useEffect(() => {
    let categoryClassmates: UserModel[] = []
    if (!classmates || !user) {
      setCategoryClassmates(categoryClassmates)
      return
    }

    for (const classmate of classmates) {
      if (classmate.grandChallengeCategory === user.grandChallengeCategory) {
        categoryClassmates = [...categoryClassmates, classmate]
      }
    }
    setCategoryClassmates(categoryClassmates)
  }, [classmates, user])

  return (
    <>
      {user && (!heroCouncil || !heroCouncil.name || !heroCouncil.declarationFileName) && <CreateCouncil
        user={user}
        heroCouncilIntroVisible={heroCouncilIntroVisible}
        setHeroCouncilIntroVisible={setHeroCouncilIntroVisible}
        categoryClassmates={categoryClassmates}
      />}

      {user && heroCouncil && heroCouncil.name && heroCouncil.declarationFileName && !heroCouncil.approved &&
      <PendingCouncilView
        user={user}
      />}
      {user && heroCouncil && heroCouncil.name && heroCouncil.declarationFileName && heroCouncil.approved &&
      <ApprovedCouncilView
        user={user}
        professorAvatar={professorAvatar}
        council={heroCouncil}
      />}
    </>
  )
}

interface CreateCouncilProps {
  user: UserModel
  heroCouncilIntroVisible: boolean
  setHeroCouncilIntroVisible: Function
  categoryClassmates: UserModel[]
}
const CreateCouncil = ({ user, heroCouncilIntroVisible, setHeroCouncilIntroVisible, categoryClassmates }: CreateCouncilProps) => {
  const dispatch = useDispatch()
  const [createHeroCouncilForm] = useForm()

  function uploadDeclaration(data: any) {
    console.log("called upload with data: ", data)
    const url = `${apiBase}/herocouncil/uploadDeclaration`

    const formData = new FormData()
    formData.append("file", data.file)
    axios.post(url, formData )
      .then(response => {
        data.onSuccess()
      })
      .catch(error => {
        data.onError()
      })
  }

  function onUploadFile(info: UploadChangeParam) {
    const { status } = info.file;
    if (status === 'done') {
      message.success(`${info.file.name} file uploaded successfully.`);
    } else if (status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  }

  function createHeroCouncil() {
    createHeroCouncilForm.validateFields()
      .then(values => {
        if (user) values.emails = [...values.emails, user.email]
        console.log("creating hero council with values: ", values)
        dispatch(saveHeroCouncil(
          "Submitted Hero Council for approval",
          values.name,
          values.emails,
          false,
          "",
          [],
          []))
        setTimeout(() => {
          dispatch(loadHeroCouncil())
        }, 1000)
      })
      .catch(error => {
        console.log("error creating hero council: ", error)
      })
  }

  return (
    <div className="councils-container">
      <HeroCouncilIntro visible={heroCouncilIntroVisible} setVisible={setHeroCouncilIntroVisible} user={user} />
      <div id="controls-container">

        <div id="controls-container__controls">
          <span id="controls-container__restart">
            <Button onClick={() => setHeroCouncilIntroVisible(true)}><RollbackOutlined />Change Category/Ideas</Button>
          </span>
          <span id="controls-container__refresh">
            <Button onClick={() => dispatch(loadClassmates())}><RedoOutlined />Refresh Ideas</Button>
          </span>
        </div>

        <Form form={createHeroCouncilForm}  id="create-council-form">

          <h3>After reading other students' ideas and deciding on a team of 3-4 Heroes, one person from your team should create the Hero Council below.</h3>

          <Form.Item
            name="name"
            style={{width: "100%", textAlign: "left"}}
            rules={[{ required: true, message: "Enter a name for your Hero Council" }]}
          >
            <Input placeholder="Hero Council Name" />
          </Form.Item>

          <Form.Item
            name="emails"
            style={{width: "100%", textAlign: "left"}}
            rules={[{ required: true, message: "Choose 2 or 3 Heroes to form a Council" }]}
          >
            <Select
              style={{width: "100%"}}
              showSearch
              placeholder="Select Hero Council members"
              mode="multiple"
            >
              {categoryClassmates.map(classmate => (
                <Select.Option value={classmate.email} key={classmate.email}>
                  <Avatar
                    style={{marginRight: "3px"}}
                    size="small"
                    icon={classmate.avatarSVG
                      ? <span dangerouslySetInnerHTML={{__html: classmate.avatarSVG}} />
                      : <UserOutlined />}
                  />
                  {classmate.username} ({classmate.email})
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="declaration" style={{textAlign: "left"}}>
            <Upload.Dragger name="file"
                            multiple={false}
                            onChange={onUploadFile}
                            customRequest={(data: any) => uploadDeclaration(data)}
            >
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">Click or drag your Hero Council Declaration to upload it.</p>
              <p className="ant-upload-hint">
                Please submit a PDF or Word document.
              </p>
            </Upload.Dragger>
          </Form.Item>

          <Button type="primary" onClick={createHeroCouncil}>Create Hero Council</Button>

        </Form>
      </div>

      <br />

      {user && categoryClassmates.length === 0 && <Empty style={{marginTop: "50px"}} description={<>No ideas for {user.grandChallengeCategory} yet</>} />}
      {categoryClassmates.map(classmate => (
        <div key={classmate.email}>
          <Comment
            author={classmate.username}
            content={
              <>
                <p>1. {classmate.idea1}</p>
                <p>2. {classmate.idea2}</p>
                <p>3. {classmate.idea3}</p>
              </>
            }
            avatar={<Avatar style={{marginRight: "3px"}} size="large" icon={classmate.avatarSVG
              ? <span dangerouslySetInnerHTML={{__html: classmate.avatarSVG}} />
              : <UserOutlined />}
            />}
          />
        </div>
      ))}
    </div>
  )
}

interface PendingCouncilViewProps {
  user: UserModel
}
const PendingCouncilView = ({ user }: PendingCouncilViewProps) => {
  return <>
    <h1 style={{textAlign: "center"}}>Your Hero Council room will be displayed once Professor Ramsey ratifies your Declaration</h1>
  </>
}

interface ApprovedCouncilViewProps {
  user: UserModel
  professorAvatar: string
  council: HeroCouncilModel
}
const ApprovedCouncilView = ({ user, professorAvatar, council }: ApprovedCouncilViewProps) => {
  return <>
    <h1 style={{textAlign: "center"}}>Hero Council Room</h1>
    {!(council.announcements) && (<Empty description={<>No activity yet. Professor Ramsey will post an update soon.</>} />)}
    {council.announcements && council.announcements.length > 0 && [...council.announcements]
      .sort((a, b) =>(a.num < b.num) ? 1 : -1)
      .map(announcement => <div key={announcement.num}>
        <Comment
          author="Professor Ramsey"
          content={
            <>
              <p>{announcement.text}</p>
            </>
          }
          avatar={<Avatar style={{marginRight: "3px"}} size="large" icon={professorAvatar
            ? <span dangerouslySetInnerHTML={{__html: professorAvatar}} />
            : <UserOutlined />}
          />}
        />
      </div>)}
  </>
}
