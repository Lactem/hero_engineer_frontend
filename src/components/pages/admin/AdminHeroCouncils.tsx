import React, { useEffect, useState } from "react"
import { useDispatch } from "react-redux"

import { GrandChallengeModel, HeroCouncilModel } from "../../../api/heroCouncilAPI"
import {
  generateCodeForGrandChallenge,
  removeHeroCouncil,
  saveGrandChallenge,
  saveHeroCouncil
} from "../../../features/heroCouncilSlice"
import apiBase from "../../../api/api"
import axios, { AxiosResponse } from "axios"

import { Button, Checkbox, Collapse, Form, Input, InputNumber, Modal, Row, Tooltip } from "antd"
import {
  ExclamationCircleOutlined,
  MinusCircleOutlined,
  PlusOutlined,
  QuestionCircleOutlined
} from "@ant-design/icons/lib"
import { CheckboxChangeEvent } from "antd/es/checkbox"
import { useForm } from "antd/lib/form/Form"
import TextArea from "antd/es/input/TextArea"


interface AdminHeroCouncilsProps {
  heroCouncils: HeroCouncilModel[]
  grandChallenges: GrandChallengeModel[]
}
export const AdminHeroCouncils = ({ heroCouncils, grandChallenges }: AdminHeroCouncilsProps) => {
  return (
    <>
      <div style={{width: "100%"}}>
        {grandChallenges.map((category, i) => (
          <div key={i} style={{textAlign: "left"}}>
            <EditCategory category={category} />
            <br />
          </div>
        ))}
      </div>

      <br />

      <div style={{width: "100%"}}>
        {heroCouncils.map((council, i) => (
          <div key={council.id} style={{textAlign: "left"}}>
            <Collapse style={{width: "100%"}}>
              <Collapse.Panel header={council.name + (council.approved ? " (approved)" : " (pending approval)")} key={i}>
                <EditHeroCouncil heroCouncil={council} />
              </Collapse.Panel>
            </Collapse>
          </div>
        ))}
      </div>
    </>
  )
}

interface EditCategoryProps {
  category: GrandChallengeModel
}
const EditCategory = ({ category }: EditCategoryProps) => {
  const dispatch = useDispatch()
  const [code, setCode] = useState(category.code)
  const [name, setName] = useState(category.grandChallenge)

  useEffect(() => {
    setCode(category.code)
    setName(category.grandChallenge)
  }, [category.grandChallenge, category.code])

  function onChangeCode(e: React.ChangeEvent<HTMLInputElement>) {
    setCode(e.target.value)
  }

  function onChangeName(e: React.ChangeEvent<HTMLInputElement>) {
    setName(e.target.value)
  }

  function generateCode() {
    dispatch(generateCodeForGrandChallenge(category.id))
  }

  function saveCode() {
    dispatch(saveGrandChallenge(category.grandChallenge, code, category.id))
  }

  function saveName() {
    dispatch(saveGrandChallenge(name, category.code, category.id));
  }

  return (
    <>
      <div style={{display: "flex", flexDirection: "row", width: "50%"}}>
        <Input placeholder="name" value={name} onChange={onChangeName} />
        <Button onClick={saveName}>Save Name</Button>
      </div>
      <div style={{display: "flex", flexDirection: "row", width: "50%"}}>
        <Input placeholder="code" value={code} onChange={onChangeCode} />
        <Button onClick={saveCode}>Save Code</Button>
        <Button onClick={generateCode}>Generate New Code</Button>
      </div>
    </>
  )
}

interface EditHeroCouncilProps {
  heroCouncil: HeroCouncilModel
}
const EditHeroCouncil = ({ heroCouncil }: EditHeroCouncilProps) => {
  const dispatch = useDispatch()
  const [form] = useForm()

  useEffect(() => form.resetFields(), [heroCouncil, form])

  function onSave() {
    form
      .validateFields()
      .then(values => {
        values.emails = values.emails.filter((email: string) => email)
        console.log("values: ", values)
        dispatch(saveHeroCouncil(
          "Successfully saved Hero Council '" + values.name + "'",
          values.name,
          values.emails,
          values.approved,
          heroCouncil.declarationFileName,
          values.announcements,
          heroCouncil.id
        ))
      })
      .catch(info => {
        console.log('Validate Failed:', info);
      })
  }

  function onClickDownload() {
    const url = `${apiBase}/herocouncil/downloadDeclaration/${heroCouncil.declarationFileName}`

    return axios.get(url, { responseType: 'arraybuffer' }).then((response: AxiosResponse) => {
      var FileSaver = require('file-saver');
      var blob = new Blob([response.data], {type: response.headers["content-type"]});
      FileSaver.saveAs(blob, heroCouncil.declarationFileName);
    })
  }

  function confirmDelete() {
    Modal.confirm({
      title: "Do you want to delete the Hero Council '" + heroCouncil.name + "'?",
      icon: <ExclamationCircleOutlined />,
      content: "You'll have to manually re-create this Hero Council if you wish to recover it.",
      onOk() {
        dispatch(removeHeroCouncil(heroCouncil.id))
      }
    })
  }

  return (
    <>
      <Button type="primary" onClick={onClickDownload}>Download Declaration</Button>
      <br /><br />

      <Form
        form={form}
        layout="vertical"
        name="saveHeroCouncilForm"
        initialValues={{
          name: heroCouncil.name,
          emails: heroCouncil.emails,
          approved: heroCouncil.approved,
          announcements: heroCouncil.announcements ? heroCouncil.announcements : []
        }}
        onFinish={onSave}
      >

        <Form.Item
          name="name"
          label="Name"
          rules={[{ required: true, message: "Name is required" }]}
        >
          <Input placeholder="Hero Council Name" />
        </Form.Item>

        <Form.Item
          label={(
            <>
              Approved by Professor
              <Tooltip title="Tick to approve this Hero Council's Declaration.">
                <QuestionCircleOutlined style={{paddingLeft: "5px"}} />
              </Tooltip>
            </>
          )}>
          <Form.Item
            name="approved"
            noStyle
          >
            <Checkbox
              defaultChecked={heroCouncil.approved}
              onChange={(e: CheckboxChangeEvent) => {
                form.setFieldsValue({"approved": e.target.checked})
              }}
            />
          </Form.Item>
        </Form.Item>

        <Form.Item
          label={(
            <>
              Students in Group
              <Tooltip title="Emails of students in this Hero Council">
                <QuestionCircleOutlined style={{paddingLeft: "5px"}} />
              </Tooltip>
            </>
          )}>
          <Form.List name="emails">
            {(fields, { add, remove }) => (
              <div style={{width: "100%"}}>
                {fields.map((field) => (
                  <>
                    <Row>
                    <Form.Item {...field}>
                      <Input placeholder="ttrojan@usc.edu" />
                    </Form.Item>
                    <MinusCircleOutlined
                      className="dynamic-delete-button"
                      onClick={() => {
                        remove(field.name);
                      }}
                    />
                    </Row>
                    </>
                ))}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => {
                      add();
                    }}
                  >
                    <PlusOutlined /> Add student
                  </Button>
                </Form.Item>
              </div>
            )}
          </Form.List>
        </Form.Item>

        <Form.Item
          label={(
            <>
              Announcements
              <Tooltip title="Text that members of this Hero Council will see in their Hero Council room">
                <QuestionCircleOutlined style={{paddingLeft: "5px"}} />
              </Tooltip>
            </>
          )}>
          <Form.List name="announcements">
            {(fields, { add, remove }) => (
              <div style={{width: "100%"}}>
                {fields.map((field) => (
                  <>
                    <Row>
                      <Form.Item name={[field.name, "num"]}
                                 label={(
                                   <>
                                     Order
                                     <Tooltip title="The order in which this announcement will be shown (higher numbers are shown first)">
                                       <QuestionCircleOutlined style={{paddingLeft: "5px"}} />
                                     </Tooltip>
                                   </>
                                 )}
                      >
                        <InputNumber />
                      </Form.Item>
                      <Form.Item label="Announcement Text" name={[field.name, "text"]}>
                        <TextArea />
                      </Form.Item>
                      <MinusCircleOutlined
                        className="dynamic-delete-button"
                        onClick={() => {
                          remove(field.name);
                        }}
                      />
                    </Row>
                  </>
                ))}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => {
                      add();
                    }}
                  >
                    <PlusOutlined /> Create new announcement
                  </Button>
                </Form.Item>
              </div>
            )}
          </Form.List>
        </Form.Item>

        <Button htmlType="submit">Save</Button>
        <Button danger onClick={confirmDelete}>Delete</Button>
      </Form>
    </>
  )
}

