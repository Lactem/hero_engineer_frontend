import React, { ChangeEvent, useState } from "react"
import { useDispatch, useSelector } from "react-redux"

import { Button, Collapse, Avatar, Checkbox, InputNumber, Tooltip, Form, Input, message } from "antd"
import { QuestionCircleOutlined, UserOutlined } from "@ant-design/icons/lib"

import CopyToClipboard from "react-copy-to-clipboard"

import { generateCode } from "../../../features/questsSlice"
import { UserModel } from "../../../api/userAPI"
import { QuestView } from "../Quests"
import { RootState } from "../../../app/rootReducer"
import { loadQuizzes } from "../../../features/quizzesSlice"
import { CheckboxChangeEvent } from "antd/es/checkbox"
import { addXP, getXPBreakdown, resetPassword } from "../../../features/userSlice"
import TextArea from "antd/es/input/TextArea"
import { useForm } from "antd/es/form/Form"
import { saveGradedShortAnswerAssignment } from "../../../features/shortAnswerAssignmentsSlice"
import { GradedShortAnswerAssignmentModel } from "../../../api/shortAnswerAssignmentsAPI"


interface AdminUsersProps {
  users: UserModel[]
}
export const AdminUsers = ({ users }: AdminUsersProps) => {
  return (
    <div style={{width: "100%"}}>
      {users.map((user, i) => (
        <div key={i} style={{textAlign: "left"}}>
          <Collapse style={{width: "100%"}}>
            <Collapse.Panel
              header={
                <>
                <Avatar style={{marginRight: "3px"}} size="large" icon={user.avatarSVG
                  ? <span dangerouslySetInnerHTML={{__html: user.avatarSVG}} />
                  : <UserOutlined />}
                />
                {user.email} ({user.xp} XP; {user.points} points)
                </>
              }
              key={i}>
              <EditUser key={user.email} user={user} />
            </Collapse.Panel>
          </Collapse>
        </div>
      ))}
    </div>
  )
}

interface EditUserProps {
  user: UserModel
}
const EditUser = ({ user }: EditUserProps) => {
  const dispatch = useDispatch()
  const [gradingForm] = useForm()
  const { quizzes } = useSelector(
    (state: RootState) => state.quizzes
  )
  const [addXPValue, setAddXPValue] = useState(0);
  const [addXpReason, setAddXpReason] = useState('')
  const [xpBreakdown, setXPBreakdown] = useState();
  if (quizzes == null) dispatch(loadQuizzes())

  function generateQuestCode(questId: string) {
    dispatch(generateCode(user.email, questId))
  }

  function onResetPasswordChange(e: CheckboxChangeEvent) {
    dispatch(resetPassword(user.email, e.target.checked))
  }

  function onAddXPChange(value: number | undefined) {
    setAddXPValue(value || 0)
  }

  function onAddXpReasonChange(event: ChangeEvent<HTMLInputElement>) {
    setAddXpReason(event.target.value)
  }

  function onAddXP() {
    if (addXpReason) {
      dispatch(addXP(user.email, addXPValue, addXpReason))
    } else {
      message.error('Please enter a reason for adding XP to this student')
    }
  }

  function fetchXPBreakdown() {
    dispatch(getXPBreakdown(user.email, setXPBreakdown))
  }

  function onGradeAssignment(assignment: GradedShortAnswerAssignmentModel, values: any) {
    console.log('values when grading assignment: ', values)
    dispatch(saveGradedShortAnswerAssignment(
      assignment.id,
      assignment.name,
      assignment.gradedQuestions,
      assignment.available,
      true,
      values.xpAwarded,
      assignment.maxXp,
      values.feedback,
      user.email,
      true
    ))
  }

  return (
    <>
      Reset Password? <Checkbox defaultChecked={user.resetPasswordOnLogin} onChange={onResetPasswordChange} />
      <br />
      <InputNumber defaultValue={0} onChange={onAddXPChange} />
      <Input placeholder="Reason for adding XP" defaultValue="" onChange={onAddXpReasonChange} />
      <Button onClick={onAddXP}>Add XP</Button>
      <br />
      <Button onClick={fetchXPBreakdown}>
        Show XP Breakdown
      </Button>
      <Tooltip title="Computes the total XP a student should have based on quiz scores and quest completion. Does not account for XP added manually by the Professor.">
        <QuestionCircleOutlined style={{paddingLeft: "5px"}} />
      </Tooltip>
      <br />
      { xpBreakdown &&
      <>
        <br />
        {Object.keys(xpBreakdown).map((key) => key === "Total" ? null :
            <div key={key}>
              { key }: { xpBreakdown[key] }
            </div>
        )}
        <hr />
        Total: { xpBreakdown["Total"] }
      </>
      }
      <br />
      <h3>Quests</h3>
      <Collapse style={{width: "100%"}}>
        {user.quests.map(quest => (
          <Collapse.Panel
            header={quest.name + (quest.main ? " (main quest)" : " (side quest)") + (quest.complete ? " (complete)" : " (incomplete)")}
            key={quest.id}
          >
            {quest.code && !quest.complete && (quest.completeWithQuizzesAndCode || quest.completeWithCode) && (
              <>
                {quest.code}
                <CopyToClipboard text={quest.code}>
                  <Button>Copy to clipboard</Button>
                </CopyToClipboard>
              </>
            )}
            <br />
            {!quest.complete && (quest.completeWithQuizzesAndCode || quest.completeWithCode) && (
              <Button onClick={() => {generateQuestCode(quest.id)}}>Generate Code</Button>
            )}
            <br />
            <Collapse style={{width: "100%"}}>
              <Collapse.Panel header={"Student's View"} key={quest.id + "view"}>
                <div style={{ width: "100%", textAlign: "center" }}>
                  {quizzes && <QuestView quest={quest} quests={user.quests} quizzes={quizzes} active={true} adminView={true} />}
                </div>
              </Collapse.Panel>
            </Collapse>
          </Collapse.Panel>
        ))}
      </Collapse>

      <br />
      <h3>In-Class Assignments</h3>
      <Collapse style={{width: "100%"}}>
        {user.gradedShortAnswerAssignments && user.gradedShortAnswerAssignments.map(assignment => (
          <Collapse.Panel
            header={assignment.name + (assignment.graded ? " (graded)" : " (pending grade)")}
            key={assignment.id}
          >

            <h4>Student Answers</h4>
            {assignment.gradedQuestions && assignment.gradedQuestions.map((question, i) => (
              <div key={question.id}>
                {i + 1}. {question.question}
                <br />
                <TextArea disabled={true} value={question.answer} />
                <br /><br />
              </div>
            ))}

            <h4>Grading</h4>
            <Form
              form={gradingForm}
              layout="vertical"
              name="shortAnswerAssignmentGradingForm"
              onFinish={(values) => onGradeAssignment(assignment, values)}
              initialValues={{
                xpAwarded: assignment.xpAwarded,
                feedback: assignment.feedback
              }}
              style={{ width: "50%" }}
            >
              <Form.Item
                name="xpAwarded"
                label={`Grade (whole number out of ${assignment.maxXp})`}
              >
                <InputNumber min={0} max={assignment.maxXp} />
              </Form.Item>

              <Form.Item
                name="feedback"
                label="Feedback (optional)"
              >
                <TextArea />
              </Form.Item>

              <Button htmlType="submit" type="primary">
                Grade Assignment
              </Button>
            </Form>
          </Collapse.Panel>
        ))}
      </Collapse>
    </>
  )
}

