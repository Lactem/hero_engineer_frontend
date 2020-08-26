import React, { useEffect, useState } from "react"
import { useDispatch } from "react-redux"

import { Modal, Form, Button, Select, Input, Tooltip, InputNumber, Collapse, Row, Col } from "antd"
import { QuestionCircleOutlined } from "@ant-design/icons"
import TextArea from "antd/es/input/TextArea"
import { SectionModel } from "../../../api/sectionAPI"
import { ShortAnswerAssignmentModel } from "../../../api/shortAnswerAssignmentsAPI"
import { deleteShortAnswerAssignment, saveShortAnswerAssignment } from "../../../features/shortAnswerAssignmentsSlice"
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons/lib"

interface AdminLiveClassroomProps {
  assignments: ShortAnswerAssignmentModel[]
  sections: SectionModel[]
}
export const AdminLiveClassroom = ({ assignments, sections }: AdminLiveClassroomProps) => {
  const dispatch = useDispatch()
  const [visible, setVisible] = useState(false)

  function onAddAssignment(values: any) {
    console.log("create assignment onFinish values: ", values)
    dispatch(saveShortAnswerAssignment(
      values.name,
      values.questions,
      values.sectionIdsAvailableFor,
      values.sectionIdsGradesAvailableFor,
      values.maxXp
    ))
    setVisible(false)
  }

  return (
    <div style={{width: "100%"}}>
      <span style={{textAlign: "center"}}>
        NOTE: Use the Class Sections tab to grade assignments.
      </span>
      <br /><br />
      {assignments.map((assignment, i) => (
        <div key={i} style={{textAlign: "left"}}>
          <Collapse style={{width: "100%"}}>
            <Collapse.Panel header={assignment.name} key={i}>
              <EditAssignment assignment={assignment} sections={sections} />
            </Collapse.Panel>
          </Collapse>
        </div>
      ))}
      <br />
      <Button onClick={() => setVisible(true)}>Create In-Class Assignment</Button>
      <AddAssignmentModal
        sections={sections}
        visible={visible}
        onAddAssignment={onAddAssignment}
        onCancel={() => setVisible(false)} />
    </div>
  )
}

interface EditAssignmentProps {
  assignment: ShortAnswerAssignmentModel
  sections: SectionModel[]
}
const EditAssignment = ({ assignment, sections }: EditAssignmentProps) => {
  const [form] = Form.useForm()
  const dispatch = useDispatch()

  useEffect(() => form.resetFields(), [assignment, sections, form])

  function onSaveAssignment() {
    form
      .validateFields()
      .then(values => {
        console.log("saving assignment values: ", values)
        dispatch(saveShortAnswerAssignment(
          values.name,
          values.questions,
          values.sectionIdsAvailableFor,
          values.sectionIdsGradesAvailableFor,
          values.maxXp,
          assignment.id
        ))
      })
      .catch(info => {
        console.log('Validate Failed:', info);
      })
  }

  function onDeleteAssignment() {
    dispatch(deleteShortAnswerAssignment(assignment.id))
  }

  return (
    <>
      <Form
        form={form}
        layout="vertical"
        name="saveAssignmentForm"
        initialValues={{
          name: assignment.name,
          questions: assignment.questions || [],
          sectionIdsAvailableFor: assignment.sectionIdsAvailableFor || [],
          sectionIdsGradesAvailableFor: assignment.sectionIdsGradesAvailableFor || [],
          maxXp: assignment.maxXp
        }}
        onFinish={onSaveAssignment}
      >

        <Form.Item
          name="name"
          label="Assignment Name"
          rules={[{ required: true, message: "Name is required" }]}
        >
          <Input placeholder="Monday Jan 1 - Reading Reflection" />
        </Form.Item>

        <Form.Item
          label={(
            <>
              Questions
              <Tooltip title="Which short-answer questions does this assignment ask?">
                <QuestionCircleOutlined style={{paddingLeft: "5px"}} />
              </Tooltip>
            </>
          )}
        >
          <Form.List name="questions">
            {(fields, { add, remove }) => {
              return (
                <div style={{width: "100%"}}>
                  {fields.map((field) => (
                    <Row key={field.key}>
                      <Collapse style={{width: "100%"}}>
                        <Collapse.Panel header={"Question " + (field.key + 1)} key={field.key}>
                          <Col style={{width: "100%"}}>
                            <Form.Item
                              label={"Question " + (field.key + 1)}
                            >
                              <div style={{width: "100%", display: "flex"}}>
                                <Col style={{width: "100%"}}>
                                  <Form.Item
                                    name={[field.name, "question"]}
                                    noStyle
                                  >
                                    <TextArea placeholder="New Question?" />
                                  </Form.Item>
                                </Col>
                                <Col>
                                  <MinusCircleOutlined
                                    className="dynamic-delete-button"
                                    onClick={() => {
                                      remove(field.name);
                                    }}
                                  />
                                </Col>
                              </div>
                            </Form.Item>
                          </Col>
                        </Collapse.Panel>
                      </Collapse>
                    </Row>
                  ))}
                  <Form.Item>
                    <Button
                      type="dashed"
                      onClick={() => {
                        add();
                      }}
                      style={{ width: "100%" }}
                    >
                      <PlusOutlined /> Add question
                    </Button>
                  </Form.Item>
                </div>
              );
            }}
          </Form.List>
        </Form.Item>

        <Form.Item
          label={(
            <>
              Class Sections That View & Submit
              <Tooltip title="Choose which class sections can view and submit this assignment.">
                <QuestionCircleOutlined style={{paddingLeft: "5px"}} />
              </Tooltip>
            </>
          )}
        >
          <Form.Item name="sectionIdsAvailableFor">
            <Select mode="multiple">
              {sections.map((section, i) => (
                <Select.Option value={section.id} key={i}>{section.name}</Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form.Item>

        <Form.Item
          label={(
            <>
              Class Sections That Can See Grades & Feedback
              <Tooltip title="Choose which class sections can view your feedback and their grade for this assignment.">
                <QuestionCircleOutlined style={{paddingLeft: "5px"}} />
              </Tooltip>
            </>
          )}
        >
          <Form.Item name="sectionIdsGradesAvailableFor">
            <Select mode="multiple">
              {sections.map((section, i) => (
                <Select.Option value={section.id} key={i}>{section.name}</Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form.Item>

        <Form.Item
          label={(
            <>
              Maximum XP
              <Tooltip title="The most XP a student can receive for completing this assignment.">
                <QuestionCircleOutlined style={{paddingLeft: "5px"}} />
              </Tooltip>
            </>
          )}
        >
          <Form.Item
            name="maxXp"
            noStyle
            rules={[{ required: true, message: "Max XP is required" }]}
          >
            <InputNumber min={0} />
          </Form.Item>
        </Form.Item>

        <Button htmlType="submit">Save Assignment</Button>
        <Button danger onClick={onDeleteAssignment}>Delete Assignment</Button>
      </Form>
    </>
  )
}

interface AddAssignmentProps {
  sections: SectionModel[]
  visible: boolean
  onAddAssignment: (values: any) => void
  onCancel: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void
}
const AddAssignmentModal = ({ sections, visible, onAddAssignment, onCancel }: AddAssignmentProps) => {
  const [form] = Form.useForm();

  return (
    <Modal
      visible={visible}
      title="Create In-Class Assignment"
      okText="Add"
      cancelText="Cancel"
      onCancel={onCancel}
      onOk={() => {
        form
          .validateFields()
          .then(values => {
            onAddAssignment(values);
            form.resetFields();
          })
          .catch(info => {
            console.log('Validate Failed:', info);
          });
      }}
    >
      <Form
        form={form}
        layout="vertical"
        name="addQuestForm"
        initialValues={{
          questions: [],
          sectionIdsAvailableFor: [],
          maxXp: 0
        }}
      >

        <Form.Item
          name="name"
          label="Assignment Name"
          rules={[{ required: true, message: "Name is required" }]}
        >
          <Input placeholder="Monday Jan 1 - Reading Reflection" />
        </Form.Item>

        <Form.Item
          label={(
            <>
              Questions
              <Tooltip title="Which short-answer questions does this assignment ask?">
                <QuestionCircleOutlined style={{paddingLeft: "5px"}} />
              </Tooltip>
            </>
          )}
        >
          <Form.List name="questions">
            {(fields, { add, remove }) => {
              return (
                <div style={{width: "100%"}}>
                  {fields.map((field) => (
                    <Row key={field.key}>
                      <Collapse style={{width: "100%"}}>
                        <Collapse.Panel header={"Question " + (field.key + 1)} key={field.key}>
                          <Col style={{width: "100%"}}>
                            <Form.Item
                              label={"Question " + (field.key + 1)}
                            >
                              <div style={{width: "100%", display: "flex"}}>
                                <Col style={{width: "100%"}}>
                                  <Form.Item
                                    name={[field.name, "question"]}
                                    noStyle
                                  >
                                    <TextArea placeholder="New Question?" />
                                  </Form.Item>
                                </Col>
                                <Col>
                                  <MinusCircleOutlined
                                    className="dynamic-delete-button"
                                    onClick={() => {
                                      remove(field.name);
                                    }}
                                  />
                                </Col>
                              </div>
                            </Form.Item>
                          </Col>
                        </Collapse.Panel>
                      </Collapse>
                    </Row>
                  ))}
                  <Form.Item>
                    <Button
                      type="dashed"
                      onClick={() => {
                        add();
                      }}
                      style={{ width: "100%" }}
                    >
                      <PlusOutlined /> Add question
                    </Button>
                  </Form.Item>
                </div>
              );
            }}
          </Form.List>
        </Form.Item>

        <Form.Item
          label={(
            <>
              Class Sections That View & Submit
              <Tooltip title="Choose which class sections can view and submit this assignment.">
                <QuestionCircleOutlined style={{paddingLeft: "5px"}} />
              </Tooltip>
            </>
          )}
        >
          <Form.Item name="sectionIdsAvailableFor">
            <Select mode="multiple">
              {sections.map((section, i) => (
                <Select.Option value={section.id} key={i}>{section.name}</Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form.Item>

        <Form.Item
          label={(
            <>
              Class Sections That Can See Grades & Feedback
              <Tooltip title="Choose which class sections can view your feedback and their grade for this assignment.">
                <QuestionCircleOutlined style={{paddingLeft: "5px"}} />
              </Tooltip>
            </>
          )}
        >
          <Form.Item name="sectionIdsGradesAvailableFor">
            <Select mode="multiple">
              {sections.map((section, i) => (
                <Select.Option value={section.id} key={i}>{section.name}</Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form.Item>

        <Form.Item
          label={(
            <>
              Maximum XP
              <Tooltip title="The most XP a student can receive for completing this assignment.">
                <QuestionCircleOutlined style={{paddingLeft: "5px"}} />
              </Tooltip>
            </>
          )}
        >
          <Form.Item
            name="maxXp"
            noStyle
            rules={[{ required: true, message: "Max XP is required" }]}
          >
            <InputNumber min={0} />
          </Form.Item>
        </Form.Item>
      </Form>
    </Modal>
  )
}
