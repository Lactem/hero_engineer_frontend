import React from "react"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../../../app/rootReducer"
import { HeroModel} from "../../../api/heroesAPI"
import { loadHeroes } from "../../../features/heroes/heroesSlice"
import { AdminHeroes } from "./AdminHero"
import { loadQuests } from "../../../features/quests/questsSlice"
import { AdminQuests } from "./AdminQuests"
import { Divider } from "antd"
import { AdminQuizzes } from "./AdminQuizzes"
import { loadQuizzes } from "../../../features/quizzes/quizzesSlice"

export const Admin = () => {
  const dispatch = useDispatch()
  const { heroes } = useSelector(
    (state: RootState) => state.heroes
  )
  const { quests, questsLoading, questsError } = useSelector(
    (state: RootState) => state.quests
  )
  const { quizzes, quizzesLoading, quizzesError } = useSelector(
    (state: RootState) => state.quizzes
  )
  if (heroes == null) dispatch(loadHeroes())
  if (quests == null) dispatch(loadQuests())
  if (quizzes == null) dispatch(loadQuizzes())

  return (
    <>
      <div style={{display: "flex", flexDirection: "column", justifyContent: "center", textAlign: "center", alignItems: "center", width: "100%"}}>
        <h1>Control Panel</h1>
        <br />
        <h2>Edit Heroes</h2>
        {heroes && <AdminHeroes heroes={heroes as HeroModel[]} />}
        <br />
        <Divider />
        <Divider />
        <Divider />
        <br />
        <h2>Edit Quests</h2>
        {questsLoading && <>Loading quests...</>}
        {questsError}
        {!questsLoading && quests && !quizzesLoading && quizzes
          && <AdminQuests quests={quests} quizzes={quizzes} />}
        <br />
        <Divider />
        <Divider />
        <Divider />
        <br />
        <h2>Edit Quizzes</h2>
        {quizzesLoading && <>Loading quizzes...</>}
        {quizzesError}
        {!quizzesLoading && quizzes && <AdminQuizzes quizzes={quizzes} />}
      </div>
    </>
  )
}
