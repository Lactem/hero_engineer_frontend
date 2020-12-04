import React, { useState } from "react"
import { useDispatch } from "react-redux"

import { HeroModel } from "../../../api/heroesAPI"
import { deleteHero, saveHero } from "../../../features/heroesSlice"
import { Button, Divider, Input, Form } from "antd"
import apiBase from "../../../api/api"
import axios, { AxiosResponse } from "axios"

interface AdminMisc {
  heroes: HeroModel[]
}
export const AdminMisc = ({ heroes }: AdminMisc) => {
  const [showAdd, setShowAdd] = useState(false)

  function handleShowAdd() {
    setShowAdd(true)
  }

  function handleAdded() {
    setShowAdd(false)
  }

  function downloadDataDump() {
    const url = `${apiBase}/statistics/dumpData`

    return axios.get(url, { responseType: 'arraybuffer' }).then((response: AxiosResponse) => {
      var FileSaver = require('file-saver');
      var blob = new Blob([response.data], {type: response.headers["content-type"]});
      FileSaver.saveAs(blob, 'HeroEngineer_Report.pdf');
    })
  }

  return (
    <>
      <h2>Statistics</h2>
      <Button type="primary" onClick={downloadDataDump}>Download Data</Button>

      <br /><br />

      <h2>Heroes</h2>
      Change the Hero options that students see when they sign up.

      <br /><br />

      {heroes.map((hero, i) => (
        <div key={i}>
          <EditHero hero={hero} />
          <Divider />
        </div>
      ))}
      <br />
      <Divider />
      {showAdd && <AddHero done={handleAdded}/>}

      <br />
      <Button onClick={handleShowAdd}>Add New Hero</Button>
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

  function handleSave() {
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
      <Form onFinish={handleSave}>
        <Input placeholder="Name"
               type="text"
               value={name}
               onChange={handleNameChange} />
        <Input placeholder="Description"
               type="text"
               value={desc}
               onChange={handleDescChange} />
        <Button htmlType="submit">Save Hero</Button>
      </Form>
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

  function handleSave() {
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
      <Form onFinish={handleSave}>
        <Input placeholder="Name"
               type="text"
               value={name}
               onChange={handleNameChange} />
        <Input placeholder="Description"
               type="text"
               value={desc}
               onChange={handleDescChange} />
        <Button htmlType="submit">Save Hero</Button>
      </Form>
      <Button danger onClick={handleDelete}>Delete Hero</Button>
    </>
  )
}
