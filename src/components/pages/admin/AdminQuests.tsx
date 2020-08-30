import React, { useEffect, useState } from "react"
import { useDispatch } from "react-redux"

import { QuestModel } from "../../../api/questsAPI"
import { deleteQuest, generateUniversalCode, saveQuest } from "../../../features/questsSlice"

import { Modal, Form, Button, Select, Input, Tooltip, Divider, Checkbox, InputNumber, Collapse } from "antd"
import { QuestionCircleOutlined } from "@ant-design/icons"
import { CheckboxChangeEvent } from "antd/es/checkbox"
import { QuizModel } from "../../../api/quizzesAPI"
import TextArea from "antd/es/input/TextArea"
import CopyToClipboard from "react-copy-to-clipboard"

interface AdminQuestsProps {
  quests: QuestModel[]
  quizzes: QuizModel[]
}
export const AdminQuests = ({ quests, quizzes }: AdminQuestsProps) => {
  const dispatch = useDispatch()
  const [visible, setVisible] = useState(false)

  function onAddQuest(values: any) {
    console.log("onFinish values: ", values)
    dispatch(saveQuest(
      values.name,
      values.description,
      values.automaticXpReward,
      values.main,
      values.available,
      false,
      values.completeWithQuizzes,
      values.completeWithCode,
      values.completeWithQuizzesAndCode,
      false,
      "",
      "",
      values.incompleteQuizIds,
      [],
      values.requiredQuestsIds
    ))
    setVisible(false)
  }

  return (
    <div style={{width: "100%"}}>
      {quests.map((quest, i) => (
        <div key={i} style={{textAlign: "left"}}>
          <Collapse style={{width: "100%"}}>
            <Collapse.Panel header={quest.name} key={i}>
              <EditQuest quest={quest} quests={quests} quizzes={quizzes} />
            </Collapse.Panel>
          </Collapse>
        </div>
      ))}
      <br />
      <Divider />
      <Button onClick={() => setVisible(true)}>Add Quest</Button>
      <AddQuestModal
        quests={quests}
        quizzes={quizzes}
        visible={visible}
        onAddQuest={onAddQuest}
        onCancel={() => setVisible(false)} />
    </div>
  )
}

interface EditQuestProps {
  quest: QuestModel
  quests: QuestModel[]
  quizzes: QuizModel[]
}
const EditQuest = ({ quest, quests, quizzes }: EditQuestProps) => {
  const [form] = Form.useForm()
  const dispatch = useDispatch()

  useEffect(() => form.resetFields(), [quest, quizzes, form])

  function onSaveQuest() {
    form
      .validateFields()
      .then(values => {
        console.log("values: ", values)
        dispatch(saveQuest(
          values.name,
          values.description,
          values.automaticXpReward,
          values.main,
          values.available,
          false,
          values.completeWithQuizzes,
          values.completeWithCode,
          values.completeWithQuizzesAndCode,
          false,
          "",
          quest.universalCode,
          values.incompleteQuizIds,
          [],
          values.requiredQuestsIds,
          quest.id
        ))
      })
      .catch(info => {
        console.log('Validate Failed:', info);
      })
  }

  function onDeleteQuest() {
    dispatch(deleteQuest(quest.id))
  }

  function generateCode(questId: string) {
    dispatch(generateUniversalCode(questId))
  }

  return (
    <>
      <Form
        form={form}
        layout="vertical"
        name="saveQuestForm"
        initialValues={{
          name: quest.name,
          description: quest.description,
          automaticXpReward: quest.automaticXpReward,
          main: quest.main,
          available: quest.available,
          completeWithQuizzes: quest.completeWithQuizzes,
          completeWithCode: quest.completeWithCode,
          completeWithQuizzesAndCode: quest.completeWithQuizzesAndCode,
          universalCode: quest.universalCode,
          incompleteQuizIds: quest.incompleteQuizIds,
          requiredQuestIds: quest.requiredQuestIds
        }}
        onFinish={onSaveQuest}
      >

        <Form.Item
          name="name"
          label="Quest Name"
          rules={[{ required: true, message: "Quest name is required" }]}
        >
          <Input placeholder="New Quest" />
        </Form.Item>

        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true, message: "Quest description is required" }]}
        >
          <TextArea placeholder="This is a description of the quest..." />
        </Form.Item>

        <Form.Item
          label={(
            <>
              XP Reward
              <Tooltip title="XP that is automatically given to the student upon completion of this quest">
                <QuestionCircleOutlined style={{paddingLeft: "5px"}} />
              </Tooltip>
            </>
          )}
        >
          <Form.Item
            name="automaticXpReward"
            noStyle
            rules={[{ required: true, message: "Quest XP Reward is required but can be set to 0" }]}
          >
            <InputNumber min={0} />
          </Form.Item>
        </Form.Item>

        <Form.Item
          label={(
            <>
              Main Quest
              <Tooltip title="Tick this box to indicate that this quest is a main (required) quest rather than a side (optional) quest">
                <QuestionCircleOutlined style={{paddingLeft: "5px"}} />
              </Tooltip>
            </>
          )}>
          <Form.Item
            name="main"
            noStyle
          >
            <Checkbox
              defaultChecked={quest.main}
              onChange={(e: CheckboxChangeEvent) => {
                form.setFieldsValue({"main": e.target.checked})
              }}
            />
          </Form.Item>
        </Form.Item>

        <Form.Item
          label={(
            <>
              Available
              <Tooltip title="Tick this box to allow students to view this quest and complete it. Untick to hide the quest.">
                <QuestionCircleOutlined style={{paddingLeft: "5px"}} />
              </Tooltip>
            </>
          )}>
          <Form.Item
            name="available"
            noStyle
          >
            <Checkbox
              defaultChecked={quest.available}
              onChange={(e: CheckboxChangeEvent) => {
                form.setFieldsValue({"available": e.target.checked})
              }}
            />
          </Form.Item>
        </Form.Item>

        <Form.Item
          label={(
            <>
              Completed by Quiz(zes)
              <Tooltip title="Tick this box to indicate that this quest is automatically completed when the quiz or quizzes are complete. No code is required to complete this quest unless you tick 'Completed by Quiz(zes) AND Code.'">
                <QuestionCircleOutlined style={{paddingLeft: "5px"}} />
              </Tooltip>
            </>
          )}>
          <Form.Item
            name="completeWithQuizzes"
            noStyle
          >
            <Checkbox
              defaultChecked={quest.completeWithQuizzes}
              onChange={(e: CheckboxChangeEvent) => {
                form.setFieldsValue({"completeWithQuizzes": e.target.checked})
              }}
            />
          </Form.Item>
        </Form.Item>

        <Form.Item
          label={(
            <>
              Completed by Code
              <Tooltip title="Tick this box to indicate that students can complete this quest by entering a code. Completing quizzes is not necessary unless you tick the box for 'Completed by Quiz(zes) AND Code.'">
                <QuestionCircleOutlined style={{paddingLeft: "5px"}} />
              </Tooltip>
            </>
          )}>
          <Form.Item
            name="completeWithCode"
            noStyle
          >
            <Checkbox
              defaultChecked={quest.completeWithCode}
              onChange={(e: CheckboxChangeEvent) => {
                form.setFieldsValue({"completeWithCode": e.target.checked})
              }}
            />
          </Form.Item>
        </Form.Item>

        <Form.Item
          label={(
            <>
              Completed by Quiz(zes) AND Code
              <Tooltip title="Tick this box to indicate that students must complete this quest both by taking a quiz (or quizzes) AND by entering a code.">
                <QuestionCircleOutlined style={{paddingLeft: "5px"}} />
              </Tooltip>
            </>
          )}>
          <Form.Item
            name="completeWithQuizzesAndCode"
            noStyle
          >
            <Checkbox
              defaultChecked={quest.completeWithQuizzesAndCode}
              onChange={(e: CheckboxChangeEvent) => {
                form.setFieldsValue({"completeWithQuizzesAndCode": e.target.checked})
              }}
            />
          </Form.Item>
        </Form.Item>

        <Form.Item>
          {quest.universalCode && (quest.completeWithQuizzesAndCode || quest.completeWithCode) && (
            <>
              {quest.universalCode}
              <CopyToClipboard text={quest.universalCode}>
                <Button>Copy to clipboard</Button>
              </CopyToClipboard>
            </>
          )}
          <br />
          {(quest.completeWithQuizzesAndCode || quest.completeWithCode) && (
            <Button onClick={() => {generateCode(quest.id)}}>Generate Universal Code</Button>
          )}
        </Form.Item>

        <Form.Item
          label={(
            <>
              Quizzes
              <Tooltip title="The quiz(zes) that must be taken to complete this quest (can be empty)">
                <QuestionCircleOutlined style={{paddingLeft: "5px"}} />
              </Tooltip>
            </>
          )}>
          <Form.Item name="incompleteQuizIds">
            <Select mode="multiple">
              {quizzes.map((quiz, i) => (
                <Select.Option value={quiz.id} key={i}>{quiz.name}</Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form.Item>

        <Form.Item
          label={(
            <>
              Required Quests
              <Tooltip title="These are other quests that must be completed before starting this quest.">
                <QuestionCircleOutlined style={{paddingLeft: "5px"}} />
              </Tooltip>
            </>
          )}>
          <Form.Item name="requiredQuestIds">
            <Select mode="multiple">
              {quests.map((otherQuest, i) => (
                otherQuest.id === quest.id ? null
                  : <Select.Option value={otherQuest.id} key={i}>{otherQuest.name}</Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form.Item>

        <Button htmlType="submit">Save Quest</Button>
        <Button danger onClick={onDeleteQuest}>Delete Quest</Button>
      </Form>
    </>
  )
}

interface AddQuestProps {
  quests: QuestModel[]
  quizzes: QuizModel[]
  visible: boolean
  onAddQuest: (values: any) => void
  onCancel: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void
}
const AddQuestModal = ({ quests, quizzes, visible, onAddQuest, onCancel }: AddQuestProps) => {
  const [form] = Form.useForm();

  return (
    <Modal
      visible={visible}
      title="Add New Quest"
      okText="Add"
      cancelText="Cancel"
      onCancel={onCancel}
      onOk={() => {
        form
          .validateFields()
          .then(values => {
            onAddQuest(values);
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
          automaticXpReward: 0,
          main: false,
          available: false,
          completeWithQuizzes: false,
          completeWithCode: false,
          completeWithQuizzesAndCode: false,
          incompleteQuizIds: [],
          requiredQuestIds: []
        }}
      >

        <Form.Item
          name="name"
          label="Quest Name"
          rules={[{ required: true, message: "Quiz name is required" }]}
        >
          <Input placeholder="New Quest" />
        </Form.Item>

        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true, message: "Quiz description is required" }]}
        >
          <TextArea placeholder="This is a description of the quest..." />
        </Form.Item>

        <Form.Item
          label={(
            <>
              XP Reward
              <Tooltip title="XP that is automatically given to the student upon completion of this quest">
                <QuestionCircleOutlined style={{paddingLeft: "5px"}} />
              </Tooltip>
            </>
          )}
        >
          <Form.Item
            name="automaticXpReward"
            noStyle
            rules={[{ required: true, message: "Quiz XP Reward is required but can be set to 0" }]}
          >
            <InputNumber min={0} />
          </Form.Item>
        </Form.Item>

        <Form.Item
          label={(
            <>
              Main Quest
              <Tooltip title="Tick this box to indicate that this quest is a main (required) quest rather than a side (optional) quest">
                <QuestionCircleOutlined style={{paddingLeft: "5px"}} />
              </Tooltip>
            </>
          )}>
          <Form.Item
            name="main"
            noStyle
          >
            <Checkbox
              onChange={(e: CheckboxChangeEvent) => {
                form.setFieldsValue({"main": e.target.checked})
              }}
            />
          </Form.Item>
        </Form.Item>

        <Form.Item
          label={(
            <>
              Available
              <Tooltip title="Tick this box to allow students to view this quest and complete it. Untick to hide the quest.">
                <QuestionCircleOutlined style={{paddingLeft: "5px"}} />
              </Tooltip>
            </>
          )}>
          <Form.Item
            name="available"
            noStyle
          >
            <Checkbox
              onChange={(e: CheckboxChangeEvent) => {
                form.setFieldsValue({"available": e.target.checked})
              }}
            />
          </Form.Item>
        </Form.Item>

        <Form.Item
          label={(
            <>
              Completed by Quiz(zes)
              <Tooltip title="Tick this box to indicate that this quest is automatically completed when the quiz or quizzes are complete. No code is required to complete this quest unless you tick 'Completed by Quiz(zes) AND Code.'">
                <QuestionCircleOutlined style={{paddingLeft: "5px"}} />
              </Tooltip>
            </>
          )}>
          <Form.Item
            name="completeWithQuizzes"
            noStyle
          >
            <Checkbox
              onChange={(e: CheckboxChangeEvent) => {
                form.setFieldsValue({"completeWithQuizzes": e.target.checked})
              }}
            />
          </Form.Item>
        </Form.Item>

        <Form.Item
          label={(
            <>
              Completed by Code
              <Tooltip title="Tick this box to indicate that students can complete this quest by entering a code. Completing quizzes is not necessary unless you tick the box for 'Completed by Quiz(zes) AND Code.'">
                <QuestionCircleOutlined style={{paddingLeft: "5px"}} />
              </Tooltip>
            </>
          )}>
          <Form.Item
            name="completeWithCode"
            noStyle
          >
            <Checkbox
              onChange={(e: CheckboxChangeEvent) => {
                form.setFieldsValue({"completeWithCode": e.target.checked})
              }}
            />
          </Form.Item>
        </Form.Item>

        <Form.Item
          label={(
            <>
              Completed by Quiz(zes) AND Code
              <Tooltip title="Tick this box to indicate that students must complete this quest both by taking a quiz (or quizzes) AND by entering a code.">
                <QuestionCircleOutlined style={{paddingLeft: "5px"}} />
              </Tooltip>
            </>
          )}>
          <Form.Item
            name="completeWithQuizzesAndCode"
            noStyle
          >
            <Checkbox
              onChange={(e: CheckboxChangeEvent) => {
                form.setFieldsValue({"completeWithQuizzesAndCode": e.target.checked})
              }}
            />
          </Form.Item>
        </Form.Item>

        <Form.Item
          label={(
            <>
              Quizzes
              <Tooltip title="The quiz(zes) that must be taken to complete this quest (can be empty)">
                <QuestionCircleOutlined style={{paddingLeft: "5px"}} />
              </Tooltip>
            </>
          )}>
          <Form.Item name="incompleteQuizIds">
            <Select mode="multiple">
              {quizzes.map((quiz, i) => (
                <Select.Option value={quiz.id} key={i}>{quiz.name}</Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form.Item>

        <Form.Item
          label={(
            <>
              Required Quests
              <Tooltip title="These are other quests that must be completed before starting this quest.">
                <QuestionCircleOutlined style={{paddingLeft: "5px"}} />
              </Tooltip>
            </>
          )}>
          <Form.Item name="requiredQuestIds">
            <Select mode="multiple">
              {quests.map((otherQuest, i) => (
                <Select.Option value={otherQuest.id} key={i}>{otherQuest.name}</Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form.Item>
      </Form>
    </Modal>
  )
}
