import React, { useState } from "react"
import { useDispatch, useSelector } from "react-redux"

import { Button, Collapse, Avatar, Checkbox, InputNumber, Tooltip } from "antd"
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
  const { quizzes } = useSelector(
    (state: RootState) => state.quizzes
  )
  const [addXPValue, setAddXPValue] = useState(0);
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

  function onAddXP() {
    dispatch(addXP(user.email, addXPValue))
  }

  function fetchXPBreakdown() {
    dispatch(getXPBreakdown(user.email, setXPBreakdown))
  }

  return (
    <>
      Reset Password? <Checkbox defaultChecked={user.resetPasswordOnLogin} onChange={onResetPasswordChange} />
      <br />
      <InputNumber defaultValue={0} onChange={onAddXPChange} /> <Button onClick={onAddXP}>Add XP</Button>
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
        {user.gradedShortAnswerAssignments.map(assignment => (
          <Collapse.Panel
            header={assignment.name + (assignment.graded ? " (graded)" : " (pending grade)")}
            key={assignment.id}
          >

            <h4>Student Answers</h4>
            {assignment.gradedQuestions.map((question, i) => (
              <div key={question.id}>
                {i + 1}. {question.question}
                <br />
                <TextArea disabled={true} value={question.answer} />
                <br /><br />
              </div>
            ))}
          </Collapse.Panel>
        ))}
      </Collapse>
    </>
  )
}

