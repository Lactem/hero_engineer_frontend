import React, { useEffect, useState } from "react"
import { useDispatch } from "react-redux"

import { Button, Collapse, Input } from "antd"

import { UserModel } from "../../../api/userAPI"
import { SectionModel } from "../../../api/sectionAPI"
import { AdminUsers } from "./AdminUsers"
import { removeSection, saveSection } from "../../../features/sectionSlice"
import { GrandChallengeModel, HeroCouncilModel } from "../../../api/heroCouncilAPI"
import { generateCodeForGrandChallenge, saveGrandChallenge } from "../../../features/heroCouncilSlice"


interface AdminHeroCouncilsProps {
  heroCouncils: HeroCouncilModel[]
  grandChallenges: GrandChallengeModel[]
}
export const AdminHeroCouncils = ({ heroCouncils, grandChallenges }: AdminHeroCouncilsProps) => {
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
      {grandChallenges.map((category, i) => (
        <div key={i} style={{textAlign: "left"}}>
          <EditCategory category={category} />
          <br />
        </div>
      ))}
    </div>
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
      <div style={{display: "flex", flexDirection: "row", width: "25%"}}>
        <Input placeholder="name" value={name} onChange={onChangeName} />
        <Button onClick={saveName}>Save Name</Button>
      </div>
      <div style={{display: "flex", flexDirection: "row", width: "25%"}}>
        <Input placeholder="code" value={code} onChange={onChangeCode} />
        <Button onClick={saveCode}>Save Code</Button>
        <Button onClick={generateCode}>Generate New Code</Button>
      </div>
    </>
  )
}

