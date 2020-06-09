import React from "react"
import { useDispatch, useSelector } from "react-redux"

import { Button, Collapse, Avatar } from "antd"
import { UserOutlined } from "@ant-design/icons/lib"

import CopyToClipboard from "react-copy-to-clipboard"

import { generateCode } from "../../../features/questsSlice"
import { UserModel } from "../../../api/userAPI"
import { QuestView } from "../Quests"
import { RootState } from "../../../app/rootReducer"
import { loadQuizzes } from "../../../features/quizzesSlice"


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
  if (quizzes == null) dispatch(loadQuizzes())

  function generateQuestCode(questId: string) {
    dispatch(generateCode(user.email, questId))
  }

  return (
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
                {quizzes && <QuestView quest={quest} quests={user.quests} quizzes={quizzes} />}
              </div>
            </Collapse.Panel>
          </Collapse>
        </Collapse.Panel>
      ))}
    </Collapse>
  )
}

