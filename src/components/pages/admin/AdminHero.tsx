import React, { useState } from "react"
import { useDispatch } from "react-redux"

import { HeroModel } from "../../../api/heroesAPI"
import { deleteHero, saveHero } from "../../../features/heroesSlice"
import { Divider } from "antd"

interface AdminHeroesProps {
  heroes: HeroModel[]
}
export const AdminHeroes = ({ heroes }: AdminHeroesProps) => {
  const [showAdd, setShowAdd] = useState(false)

  function handleShowAdd() {
    setShowAdd(true)
  }

  function handleAdded() {
    setShowAdd(false)
  }

  return (
    <>
      {heroes.map((hero, i) => (
        <div key={i}>
          <EditHero hero={hero} />
          <Divider />
        </div>
      ))}
      <br />
      <Divider />
      {showAdd && <AddHero done={handleAdded}/>}
      <button onClick={handleShowAdd}>Add Hero</button>
    </>
  )
}

interface AddHeroProps {
  done: Function
}
const AddHero = ({ done }: AddHeroProps) => {
  const dispatch = useDispatch()
  const [name, setName] = useState("New Hero Name")
  const [desc, setDesc] = useState("New Hero Desc")

  function handleSave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    dispatch(saveHero(name, desc))
    done()
    setName("New Hero Name")
    setDesc("New Hero Desc")
  }

  function handleNameChange(event: React.ChangeEvent<HTMLInputElement>) {
    setName(event.target.value)
  }

  function handleDescChange(event: React.ChangeEvent<HTMLInputElement>) {
    setDesc(event.target.value)
  }

  return (
    <>
      <form onSubmit={handleSave}>
        <label>
          Name
          <input type="text"
                 value={name}
                 onChange={handleNameChange} />
        </label>
        <label>
          Description
          <input type="text"
                 value={desc}
                 onChange={handleDescChange} />
        </label>
        <input type="submit" value="Add Hero" />
      </form>
    </>
  )
}

interface EditHeroProps {
  hero: HeroModel
}
const EditHero = ({ hero }: EditHeroProps) => {
  const dispatch = useDispatch()
  const [name, setName] = useState(hero.name)
  const [desc, setDesc] = useState(hero.desc)

  function handleSave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    dispatch(saveHero(name, desc, hero.id))
  }

  function handleDelete() {
    dispatch(deleteHero(hero.id))
  }

  function handleNameChange(event: React.ChangeEvent<HTMLInputElement>) {
    setName(event.target.value)
  }

  function handleDescChange(event: React.ChangeEvent<HTMLInputElement>) {
    setDesc(event.target.value)
  }

  return (
    <>
      <form onSubmit={handleSave}>
        <label>
          Name
          <input type="text"
                 value={name}
                 onChange={handleNameChange} />
        </label>
        <label>
          Description
          <input type="text"
                 value={desc}
                 onChange={handleDescChange} />
        </label>
        <input type="submit" value="Save Hero" />
      </form>
      <button onClick={handleDelete}>Delete Hero</button>
    </>
  )
}
