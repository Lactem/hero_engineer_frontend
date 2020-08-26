import React, { useEffect, useState } from "react"
import { useDispatch } from "react-redux"

import { Button, Collapse, Input } from "antd"

import { UserModel } from "../../../api/userAPI"
import { SectionModel } from "../../../api/sectionAPI"
import { AdminUsers } from "./AdminUsers"
import { removeSection, saveSection } from "../../../features/sectionSlice"


interface AdminSectionsProps {
  users: UserModel[]
  sections: SectionModel[]
}
export const AdminSections = ({ users, sections }: AdminSectionsProps) => {
  const dispatch = useDispatch()
  const [name, setName] = useState("")

  function onChangeName(e: React.ChangeEvent<HTMLInputElement>) {
    setName(e.target.value)
  }

  function createSection() {
    dispatch(saveSection(name, []))
  }

  function deleteSection(id: string) {
    dispatch(removeSection(id))
  }

  return (
    <div style={{width: "100%"}}>
      {sections.map((section, i) => (
        <div key={i} style={{textAlign: "left"}}>
          <Collapse style={{width: "100%"}}>
            <Collapse.Panel
              header={
                <>
                {section.name} ({section.emails.length} students)
                </>
              }
              key={i}>
              <EditSection section={section} allUsers={users} />
              <br />
              <Button danger={true} onClick={() => deleteSection(section.id)}>Delete Section</Button>
            </Collapse.Panel>
          </Collapse>
        </div>
      ))}

      <br />
      <div style={{display: "flex", flexDirection: "row", width: "25%"}}>
        <Input placeholder="Mon/Wed 11-12pm" onChange={onChangeName} />
        <Button onClick={createSection}>Create Section</Button>
      </div>
    </div>
  )
}

interface EditSectionProps {
  section: SectionModel,
  allUsers: UserModel[]
}
const EditSection = ({ section, allUsers }: EditSectionProps) => {
  const dispatch = useDispatch()
  const [users, setUsers] = useState([] as UserModel[])
  const [unregisteredEmails, setUnregisteredEmails] = useState([] as string[])
  const [email, setEmail] = useState("")

  useEffect(() => {
    let users: UserModel[] = []
    let unregisteredEmails: string[] = []
    for (const email of section.emails) {
      let userExists: boolean = false;
      for (const user of allUsers) {
        if (user.email.toLowerCase() === email.toLowerCase()) {
          userExists = true;
          users = [...users, user]
          break;
        }
      }
      if (!userExists) unregisteredEmails = [...unregisteredEmails, email]
    }
    setUnregisteredEmails(unregisteredEmails)
    setUsers(users)
  }, [allUsers, section.emails])

  function onChangeEmail(e: React.ChangeEvent<HTMLInputElement>) {
    setEmail(e.target.value)
  }

  function removeEmail() {
    if (!email) alert("Cannot add a blank email")
    dispatch(saveSection(section.name, section.emails.filter((email1) => email1 !== email), section.id))
  }

  function addEmail() {
    if (!email) alert("Cannot add a blank email")
    dispatch(saveSection(section.name, [...section.emails, email], section.id))
  }

  return (
    <>
      <div style={{display: "flex", flexDirection: "row", width: "50%"}}>
        <Input placeholder="ttrojan@usc.edu" onChange={onChangeEmail} />
        <Button onClick={addEmail}>Add</Button>
        <Button onClick={removeEmail}>Remove</Button>
      </div>

      <br /> <br />
      <AdminUsers users={users} />
      {unregisteredEmails.length > 0 && (
        <>
          <br />
          <h3>Unregistered Emails</h3>
          {unregisteredEmails.map((email) => (
            <div key={email}>
              {email}
            </div>
          ))}
          </>
      )}
    </>
  )
}

