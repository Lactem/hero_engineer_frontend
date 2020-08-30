import React from "react"
import { useDispatch, useSelector } from "react-redux"

import { Tabs } from "antd"

import { RootState } from "../../../app/rootReducer"
import { HeroModel} from "../../../api/heroesAPI"
import { loadHeroes } from "../../../features/heroesSlice"
import { AdminHeroes } from "./AdminHero"
import { loadQuests } from "../../../features/questsSlice"
import { AdminQuests } from "./AdminQuests"
import { loadQuizzes } from "../../../features/quizzesSlice"
import { loadAllUsers, loadWhitelist } from "../../../features/userSlice"
import { AdminUserWhitelist } from "./AdminUserWhitelist"
import { loadAllSections } from "../../../features/sectionSlice"
import { AdminSections } from "./AdminSections"
import { loadAllGrandChallenges, loadAllHeroCouncils } from "../../../features/heroCouncilSlice"
import { AdminHeroCouncils } from "./AdminHeroCouncils"
import { LoadingOutlined } from "@ant-design/icons/lib"
import { AdminLiveClassroom } from "./AdminLiveClassroom"
import { loadShortAnswerAssignments } from "../../../features/shortAnswerAssignmentsSlice"
import { AdminQuizzes } from "./AdminQuizzes"

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
  const { allUsers, allUsersLoading, userWhitelist } = useSelector(
    (state: RootState) => state.user
  )
  const { allSections } = useSelector(
    (state: RootState) => state.section
  )
  const { allHeroCouncils, allGrandChallenges } = useSelector(
    (state: RootState) => state.heroCouncil
  )
  const { allAssignments, allAssignmentsLoading, allAssignmentsError } = useSelector(
    (state: RootState) => state.shortAnswerAssignments
  )
  if (heroes == null) dispatch(loadHeroes())
  if (quests == null) dispatch(loadQuests())
  if (quizzes == null) dispatch(loadQuizzes())
  if (allUsers === null && !allUsersLoading) dispatch(loadAllUsers())
  if (userWhitelist == null) dispatch(loadWhitelist())
  if (allSections == null) dispatch(loadAllSections())
  if (allHeroCouncils == null) dispatch(loadAllHeroCouncils())
  if (allGrandChallenges == null) dispatch(loadAllGrandChallenges())
  if (allAssignments == null) dispatch(loadShortAnswerAssignments())

  return (
    <>
      <div style={{display: "flex", flexDirection: "column", justifyContent: "center", textAlign: "center", alignItems: "center", width: "100%"}}>
        <h1>Control Panel</h1>
        <br />
        <Tabs animated={true} defaultActiveKey="1" type="card" size="large">
          <Tabs.TabPane tab="Allowed List" key="1">
            {userWhitelist && <AdminUserWhitelist whitelist={userWhitelist} />}
          </Tabs.TabPane>
          <Tabs.TabPane tab="Class Sections" key="2">
            {allUsers && allSections && <AdminSections users={allUsers} sections={allSections} />}
          </Tabs.TabPane>
          <Tabs.TabPane tab="Live Classroom" key="3">
            {allAssignmentsLoading && <LoadingOutlined />}
            {allAssignmentsError && (
              <div style={{textAlign: "center", color: "red"}}>
                {allAssignmentsError}
              </div>
            )}
            {!allAssignmentsLoading && allAssignments && allSections && <AdminLiveClassroom assignments={allAssignments} sections={allSections} />}
          </Tabs.TabPane>
          <Tabs.TabPane tab="Quests" key="4">
            {questsLoading && <>Loading quests...</>}
            {questsError}
            {!questsLoading && quests && !quizzesLoading && quizzes && <AdminQuests quests={quests} quizzes={quizzes} />}
          </Tabs.TabPane>
          <Tabs.TabPane tab="Quizzes" key="5">
            {quizzesLoading && <>Loading quizzes...</>}
            {quizzesError}
            {!quizzesLoading && quizzes && <AdminQuizzes quizzes={quizzes} />}
          </Tabs.TabPane>
          <Tabs.TabPane tab="Councils & Grand Challenges" key="6">
            {allHeroCouncils && allGrandChallenges && <AdminHeroCouncils heroCouncils={allHeroCouncils} grandChallenges={allGrandChallenges} />}
          </Tabs.TabPane>
          <Tabs.TabPane tab="Heroes" key="7">
            {heroes && <AdminHeroes heroes={heroes as HeroModel[]} />}
          </Tabs.TabPane>
        </Tabs>
      </div>
    </>
  )
}
