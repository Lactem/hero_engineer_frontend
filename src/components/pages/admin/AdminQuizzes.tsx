import React, { useEffect, useState } from "react"
import { useDispatch } from "react-redux"

import { QuizModel } from "../../../api/quizzesAPI"
import { deleteQuiz, saveQuiz } from "../../../features/quizzesSlice"
import "./AdminQuizzes.css"

import { Modal, Form, Button, Input, Tooltip, Divider, Row, Col, Checkbox, InputNumber, Collapse } from "antd"
import { QuestionCircleOutlined, MinusCircleOutlined, PlusOutlined } from "@ant-design/icons"
import { CheckboxChangeEvent } from "antd/es/checkbox"

interface AdminQuizzesProps {
  quizzes: QuizModel[]
}
export const AdminQuizzes = ({ quizzes }: AdminQuizzesProps) => {
  const dispatch = useDispatch()
  const [visible, setVisible] = useState(false)

  function onAddQuiz(values: any) {
    console.log("create quiz onFinish values: ", values)
    dispatch(saveQuiz(
      values.name,
      values.locked,
      values.viewable,
      values.numQuestions,
      values.questionBank
    ))
    setVisible(false)
  }

  return (
    <div style={{width: "100%"}}>
      {quizzes.map((quiz, i) => (
        <div key={i} style={{textAlign: "left"}}>
          <Collapse>
            <Collapse.Panel header={quiz.name} key={i}>
              <EditQuiz quiz={quiz} />
            </Collapse.Panel>
          </Collapse>
        </div>
      ))}
      <br />
      <Divider />
      <Button onClick={() => setVisible(true)}>Add Quiz</Button>
      <AddQuizModal
        visible={visible}
        onAddQuiz={onAddQuiz}
        onCancel={() => setVisible(false)} />
    </div>
  )
}

interface EditQuizProps {
  quiz: QuizModel
}
const EditQuiz = ({ quiz }: EditQuizProps) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch()

  useEffect(() => form.resetFields(), [quiz, form])

  function onSaveQuiz() {
    form
      .validateFields()
      .then(values => {
        console.log("save quiz onFinish values: ", values)
        dispatch(saveQuiz(
          values.name,
          values.locked,
          values.viewable,
          values.numQuestions,
          values.questionBank,
          quiz.id
        ))
      })
      .catch(info => {
        console.log('Validate Failed:', info);
      });
  }

  function onDeleteQuiz() {
    dispatch(deleteQuiz(quiz.id))
  }

  return (
    <Form
      form={form}
      layout="vertical"
      name="addQuizForm"
      initialValues={{
        name: quiz.name,
        locked: quiz.locked,
        viewable: quiz.viewable,
        numQuestions: quiz.numQuestions,
        questionBank: quiz.questionBank
      }}
      onFinish={onSaveQuiz}
    >

      <Form.Item
        name="name"
        label="Quiz Name"
        rules={[{ required: true, message: "Quiz name is required" }]}
      >
        <Input placeholder="New Quiz" />
      </Form.Item>

      <Form.Item
        label={(
          <>
            Locked
            <Tooltip title="Tick to indicate that this quiz is locked. Students will not be able to view the quiz until you unlock it.">
              <QuestionCircleOutlined style={{paddingLeft: "5px"}} />
            </Tooltip>
          </>
        )}>
        <Form.Item
          name="locked"
          noStyle
        >
          <Checkbox
            defaultChecked={quiz.locked}
            onChange={(e: CheckboxChangeEvent) => {
              form.setFieldsValue({"locked": e.target.checked})
            }}
          />
        </Form.Item>
      </Form.Item>

      <Form.Item
        label={(
          <>
            Answers Viewable
            <Tooltip title="Tick to allow students to view the correct answers after they've taken this quiz. It's recommended to leave this unticked until after every student has finished this quiz.">
              <QuestionCircleOutlined style={{paddingLeft: "5px"}} />
            </Tooltip>
          </>
        )}>
        <Form.Item
          name="viewable"
          noStyle
        >
          <Checkbox
            defaultChecked={quiz.viewable}
            onChange={(e: CheckboxChangeEvent) => {
              form.setFieldsValue({"viewable": e.target.checked})
            }}
          />
        </Form.Item>
      </Form.Item>

      <Form.Item
        label={(
          <>
            Number of Questions
            <Tooltip title="The number of questions (from the question bank) that will be asked on this quiz">
              <QuestionCircleOutlined style={{paddingLeft: "5px"}} />
            </Tooltip>
          </>
        )}>
        <Form.Item
          name="numQuestions"
          noStyle
        >
          <InputNumber min={1} />
        </Form.Item>
      </Form.Item>


      <Form.Item
        label={(
          <>
            Question Bank
            <Tooltip title="The questions that can be asked on this quiz">
              <QuestionCircleOutlined style={{paddingLeft: "5px"}} />
            </Tooltip>
          </>
        )}>
        <Form.List name="questionBank">
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
                                  <Input placeholder="New Question?" />
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

                        <Col style={{width: "100%"}}>
                          <Form.Item
                            label={(
                              <>
                                Points
                                <Tooltip title="The number of grade points this question is worth">
                                  <QuestionCircleOutlined style={{paddingLeft: "5px"}} />
                                </Tooltip>
                              </>
                            )}>
                            <Form.Item
                              name={[field.name, "points"]}
                              noStyle
                            >
                              <InputNumber min={1} defaultValue={1} />
                            </Form.Item>
                          </Form.Item>
                        </Col>

                        <Col style={{width: "100%"}}>
                          <Form.Item
                            label={(
                              <>
                                Answers
                                <Tooltip title="All answer options for this question">
                                  <QuestionCircleOutlined style={{paddingLeft: "5px"}} />
                                </Tooltip>
                              </>
                            )}>
                            <Form.List name={[field.name, "answerOptions"]}>
                              {(fields, { add, remove }) => {
                                return (
                                  <div style={{width: "100%"}}>
                                    {fields.map((fieldAnswer) => (
                                      <Row key={fieldAnswer.key}>
                                        <Collapse style={{width: "100%"}}>
                                          <Collapse.Panel header={"Answer " + (fieldAnswer.key + 1)} key={fieldAnswer.key}>
                                            <Col style={{width: "100%"}}>
                                              <Form.Item
                                                label={"Answer " + (fieldAnswer.key + 1)}
                                              >
                                                <div style={{width: "100%", display: "flex"}}>
                                                  <Col style={{width: "100%"}}>
                                                    <Form.Item
                                                      name={[fieldAnswer.name, "answer"]}
                                                      noStyle
                                                    >
                                                      <Input placeholder="Answer" />
                                                    </Form.Item>
                                                  </Col>
                                                  <Col>
                                                    <MinusCircleOutlined
                                                      className="dynamic-delete-button"
                                                      onClick={() => {
                                                        remove(fieldAnswer.name);
                                                      }}
                                                    />
                                                  </Col>
                                                </div>
                                              </Form.Item>
                                            </Col>

                                            <Col style={{width: "100%"}}>
                                              <Form.Item
                                                label={(
                                                  <>
                                                    Correct?
                                                    <Tooltip title="Tick to indicate that this is the correct answer to the question">
                                                      <QuestionCircleOutlined style={{paddingLeft: "5px"}} />
                                                    </Tooltip>
                                                  </>
                                                )}>
                                                <Form.Item
                                                  name={[fieldAnswer.name, "correct"]}
                                                  noStyle
                                                >
                                                  <Checkbox
                                                    onChange={(e: CheckboxChangeEvent) => {
                                                      const questions = form.getFieldValue("questionBank")
                                                      const answers = form.getFieldValue("questionBank")[field.key]["answerOptions"]
                                                      answers[fieldAnswer.name] = {...answers[fieldAnswer.name], correct: e.target.checked}
                                                      questions[field.key]["answerOptions"] = answers;
                                                      form.setFieldsValue({"questionBank": questions})
                                                    }}
                                                  />
                                                </Form.Item>
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
                                        <PlusOutlined /> Add answer for question {field.key + 1}
                                      </Button>
                                    </Form.Item>
                                  </div>
                                );
                              }}
                            </Form.List>
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
      <Button htmlType="submit">Save Quiz</Button>
      <Button danger onClick={onDeleteQuiz}>Delete Quiz</Button>
    </Form>
  )
}

interface AddQuizProps {
  visible: boolean
  onAddQuiz: (values: any) => void
  onCancel: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void
}
const AddQuizModal = ({ visible, onAddQuiz, onCancel }: AddQuizProps) => {
  const [form] = Form.useForm();

  return (
    <Modal
      visible={visible}
      title="Add New Quiz"
      okText="Add"
      cancelText="Cancel"
      onCancel={onCancel}
      onOk={() => {
        form
          .validateFields()
          .then(values => {
            onAddQuiz(values);
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
        name="addQuizForm"
        initialValues={{ locked: true, viewable: false, numQuestions: 1 }}
      >

        <Form.Item
          name="name"
          label="Quiz Name"
          rules={[{ required: true, message: "Quiz name is required" }]}
        >
          <Input placeholder="New Quiz" />
        </Form.Item>

        <Form.Item
          label={(
            <>
              Locked
              <Tooltip title="Tick to indicate that this quiz is locked. Students will not be able to view the quiz until you unlock it.">
                <QuestionCircleOutlined style={{paddingLeft: "5px"}} />
              </Tooltip>
            </>
          )}>
          <Form.Item
            name="locked"
            noStyle
          >
            <Checkbox
              defaultChecked={true}
              onChange={(e: CheckboxChangeEvent) => {
                form.setFieldsValue({"locked": e.target.checked})
              }}
            />
          </Form.Item>
        </Form.Item>

        <Form.Item
          label={(
            <>
              Answers Viewable
              <Tooltip title="Tick to allow students to view the correct answers after they've taken this quiz. It's recommended to leave this unticked until after every student has finished this quiz.">
                <QuestionCircleOutlined style={{paddingLeft: "5px"}} />
              </Tooltip>
            </>
          )}>
          <Form.Item
            name="viewable"
            noStyle
          >
            <Checkbox
              onChange={(e: CheckboxChangeEvent) => {
                form.setFieldsValue({"viewable": e.target.checked})
              }}
            />
          </Form.Item>
        </Form.Item>

        <Form.Item
          label={(
            <>
              Number of Questions
              <Tooltip title="The number of questions (from the question bank) that will be asked on this quiz">
                <QuestionCircleOutlined style={{paddingLeft: "5px"}} />
              </Tooltip>
            </>
          )}>
          <Form.Item
            name="numQuestions"
            noStyle
          >
            <InputNumber min={1} />
          </Form.Item>
        </Form.Item>


        <Form.Item
          label={(
            <>
              Question Bank
              <Tooltip title="The questions that can be asked on this quiz">
                <QuestionCircleOutlined style={{paddingLeft: "5px"}} />
              </Tooltip>
            </>
          )}>
          <Form.List name="questionBank">
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
                                    <Input placeholder="New Question?" />
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

                          <Col style={{width: "100%"}}>
                            <Form.Item
                              label={(
                                <>
                                  Points
                                  <Tooltip title="The number of grade points this question is worth">
                                    <QuestionCircleOutlined style={{paddingLeft: "5px"}} />
                                  </Tooltip>
                                </>
                              )}>
                              <Form.Item
                                name={[field.name, "points"]}
                                noStyle
                              >
                                <InputNumber min={1} defaultValue={1} />
                              </Form.Item>
                            </Form.Item>
                          </Col>

                          <Col style={{width: "100%"}}>
                            <Form.Item
                              label={(
                                <>
                                  Answers
                                  <Tooltip title="All answer options for this question">
                                    <QuestionCircleOutlined style={{paddingLeft: "5px"}} />
                                  </Tooltip>
                                </>
                              )}>
                              <Form.List name={[field.name, "answerOptions"]}>
                                {(fields, { add, remove }) => {
                                  return (
                                    <div style={{width: "100%"}}>
                                      {fields.map((fieldAnswer) => (
                                        <Row key={fieldAnswer.key}>
                                          <Collapse style={{width: "100%"}}>
                                            <Collapse.Panel header={"Answer " + (fieldAnswer.key + 1)} key={fieldAnswer.key}>
                                              <Col style={{width: "100%"}}>
                                                <Form.Item
                                                  label={"Answer " + (fieldAnswer.key + 1)}
                                                >
                                                  <div style={{width: "100%", display: "flex"}}>
                                                    <Col style={{width: "100%"}}>
                                                      <Form.Item
                                                        name={[fieldAnswer.name, "answer"]}
                                                        noStyle
                                                      >
                                                        <Input placeholder="Answer" />
                                                      </Form.Item>
                                                    </Col>
                                                    <Col>
                                                      <MinusCircleOutlined
                                                        className="dynamic-delete-button"
                                                        onClick={() => {
                                                          remove(fieldAnswer.name);
                                                        }}
                                                      />
                                                    </Col>
                                                  </div>
                                                </Form.Item>
                                              </Col>

                                              <Col style={{width: "100%"}}>
                                                <Form.Item
                                                  label={(
                                                    <>
                                                      Correct?
                                                      <Tooltip title="Tick to indicate that this is the correct answer to the question">
                                                        <QuestionCircleOutlined style={{paddingLeft: "5px"}} />
                                                      </Tooltip>
                                                    </>
                                                  )}>
                                                  <Form.Item
                                                    name={[fieldAnswer.name, "correct"]}
                                                    noStyle
                                                    initialValue={false}
                                                  >
                                                    <Checkbox
                                                      onChange={(e: CheckboxChangeEvent) => {
                                                        const questions = form.getFieldValue("questionBank")
                                                        const answers = form.getFieldValue("questionBank")[field.key]["answerOptions"]
                                                        answers[fieldAnswer.name] = {...answers[fieldAnswer.name], correct: e.target.checked}
                                                        questions[field.key]["answerOptions"] = answers;
                                                        form.setFieldsValue({"questionBank": questions})
                                                      }}
                                                    />
                                                  </Form.Item>
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
                                          <PlusOutlined /> Add answer for question {field.key + 1}
                                        </Button>
                                      </Form.Item>
                                    </div>
                                  );
                                }}
                              </Form.List>
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
      </Form>
    </Modal>
  )
}
