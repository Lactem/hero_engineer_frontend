import React from "react"
import { useDispatch } from "react-redux"

import { Button, Collapse, Avatar } from "antd"
import { UserOutlined } from "@ant-design/icons/lib"

import CopyToClipboard from "react-copy-to-clipboard"

import { generateCode } from "../../../features/quests/questsSlice"
import { UserModel } from "../../../api/userAPI"


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
                {user.email}
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
        </Collapse.Panel>
      ))}
    </Collapse>
  )
}
