import React, { useEffect, useState } from "react"
import { useDispatch } from "react-redux"

import { QuestModel } from "../../../api/questsAPI"
import { deleteQuest, saveQuest } from "../../../features/quests/questsSlice"

import { Modal, Form, Button, Select, Input, Tooltip, Divider, Checkbox, InputNumber, Collapse } from "antd"
import { QuestionCircleOutlined } from "@ant-design/icons"
import { CheckboxChangeEvent } from "antd/es/checkbox"
import { QuizModel } from "../../../api/quizzesAPI"
import TextArea from "antd/es/input/TextArea"

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
      false,
      values.completeWithQuizzes,
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
  const [form] = Form.useForm();
  const dispatch = useDispatch()

  useEffect(() => form.resetFields(), [quest, quizzes, form])

  function onSaveQuest() {
    form
      .validateFields()
      .then(values => {
        console.log("onFinish values: ", values)
        dispatch(saveQuest(
          values.name,
          values.description,
          values.automaticXpReward,
          values.main,
          false,
          values.completeWithQuizzes,
          values.incompleteQuizIds,
          [],
          values.requiredQuestsIds,
          quest.id
        ))
      })
      .catch(info => {
        console.log('Validate Failed:', info);
      });
  }

  function onDeleteQuest() {
    dispatch(deleteQuest(quest.id))
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
          completeWithQuizzes: quest.completeWithQuizzes,
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
              Completed by Quiz(zes)
              <Tooltip title="Tick this box to indicate that this quest is automatically completed when the quiz or quizzes are complete. Leave unticked to indicate that you will manually mark this quest as complete once you grade the assignment associated with it.">
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
          completeWithQuizzes: false,
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
              Completed by Quiz(zes)
              <Tooltip title="Tick this box to indicate that this quest is automatically completed when the quiz or quizzes are complete. Leave unticked to indicate that you will manually mark this quest as complete once you grade the assignment associated with it.">
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
