import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"

import { Button, Tag, Tooltip, Form, Radio, Collapse, Input, Menu } from "antd"
import { useForm } from "antd/es/form/Form"
import { RadioChangeEvent } from "antd/es/radio"
import { CheckCircleOutlined, ClockCircleOutlined, StarOutlined, LockOutlined, ExclamationCircleOutlined } from "@ant-design/icons"

import { RootState } from "../../app/rootReducer"
import { gradeQuiz, loadQuizzes } from "../../features/quizzesSlice"
import { enterCode } from "../../features/questsSlice"
import { QuestModel } from "../../api/questsAPI"
import { AnswerModel, QuizModel } from "../../api/quizzesAPI"

import "./Quests.scss"
import { CheckCircleTwoTone, ClockCircleTwoTone, EyeInvisibleOutlined } from "@ant-design/icons/lib"
import { loadProfile } from "../../features/userSlice"

export const Quests = () => {
  const dispatch = useDispatch()
  const [selectedQuest, setSelectedQuest] = useState<QuestModel>()
  const { user } = useSelector(
    (state: RootState) => state.user
  )
  const { quizzes, quizzesLoading, quizzesError } = useSelector(
    (state: RootState) => state.quizzes
  )
  if (quizzes == null) dispatch(loadQuizzes())

  useEffect(() => {
    if (user && user.quests && quizzes && selectedQuest == null) {
      for (const quest of user.quests) {
        if (quest.main) {
          setSelectedQuest(quest)
          return
        }
      }
    }
  }, [user, selectedQuest, quizzes])

  return (
    <>
      {user && user.quests && quizzes && selectedQuest && (
        <>
          <div className="quests-menu">
            <Menu
              style={{ width: 400 }}
              defaultSelectedKeys={[selectedQuest.name]}
              defaultOpenKeys={["Main Quests", "Side Quests"]}
              mode="inline"
            >
              <Menu.SubMenu title="Main Quests" key="Main Quests">
                {user.quests.filter(quest => quest.main).map((quest) => (
                  <Menu.Item key={quest.name}
                             disabled={!quest.available}
                             onClick={() => { if (quest.available) setSelectedQuest(quest) }}
                             icon={quest.available
                               ? (quest.complete ? <CheckCircleTwoTone twoToneColor="#52c41a" /> : <ClockCircleTwoTone twoToneColor="#ffd591" />)
                               : <EyeInvisibleOutlined />}
                  >
                    {quest.name}
                  </Menu.Item>
                ))}
              </Menu.SubMenu>
              <Menu.SubMenu title="Side Quests" key="Side Quests">
                {user.quests.filter(quest => !quest.main).map((quest) => (
                  <Menu.Item
                    key={quest.name}
                    disabled={!quest.available}
                    onClick={() => { if (quest.available) setSelectedQuest(quest) }}
                    icon={quest.available
                      ? (quest.complete ? <CheckCircleTwoTone twoToneColor="#52c41a" /> : <ClockCircleTwoTone twoToneColor="#ffd591" />)
                      : <EyeInvisibleOutlined />}
                  >
                    {quest.name}
                  </Menu.Item>
                ))}
              </Menu.SubMenu>
            </Menu>
          </div>
          <div className="quest-view-container">
            {user.quests.map((quest) => (
              <QuestView quest={quest} quests={user.quests} quizzes={quizzes} active={quest.name === selectedQuest.name} adminView={false} />
            ))}
          </div>
        </>
      )}
    </>
  )
}

export interface QuestViewProps {
  quest: QuestModel
  quests: QuestModel[]
  quizzes: QuizModel[]
  active: boolean
  adminView: boolean // Admin View makes the position relative instead of absolute so that it can display on the admin page
}
export const QuestView = ({ quest, quests, quizzes, active, adminView }: QuestViewProps) => {
  const dispatch = useDispatch()
  const [codeForm] = useForm()
  const [state, setState] = useState('hidden')
  const [stateTimeout, setStateTimeout] = useState({} as NodeJS.Timeout)
  const [requiredQuests, setRequiredQuests] = useState([] as QuestModel[])
  const [requiredIncompleteQuests, setRequiredIncompleteQuests] = useState([] as QuestModel[])
  const [incompleteQuizzes, setIncompleteQuizzes] = useState([] as QuizModel[])
  const [quiz, setQuiz] = useState({} as QuizModel)
  const [totalPercentCorrect, setTotalPercentCorrect] = useState(0)
  const [xpReward, setXpReward] = useState(0)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    let incompleteQuizzes: QuizModel[] = []
    for (const quiz of quizzes) {
      for (const quizId of quest.incompleteQuizIds) {
        if (quizId === quiz.id) incompleteQuizzes = [...incompleteQuizzes, quiz]
      }
    }
    setIncompleteQuizzes(incompleteQuizzes)
  }, [quest.incompleteQuizIds, quizzes])

  useEffect(() => {
    clearTimeout(stateTimeout)
    if (active) {
      if (state === 'visible') return;
      setState('fading-in')
      setStateTimeout(setTimeout(() => {
        setState('visible')
      }, 1))
    } else {
      if (state === 'hidden') return;
      setState('fading-out')
      setStateTimeout(setTimeout(() => {
        setState('hidden')
      }, 500))
    }
  }, [active])

  useEffect(() => {
    let requiredQuests: QuestModel[] = []
    for (const requiredQuestId  of quest.requiredQuestIds) {
      for (const otherQuest of quests) {
        if (requiredQuestId === otherQuest.id) {
          if (otherQuest) requiredQuests = [...requiredQuests, otherQuest]
          else break
        }
      }
    }
    setRequiredQuests(requiredQuests)
  }, [quest.requiredQuestIds, quests])

  useEffect(() => {
    let requiredIncompleteQuests: QuestModel[] = []
    for (const requiredQuest  of requiredQuests) {
      if (!requiredQuest.complete) {
        requiredIncompleteQuests = [...requiredIncompleteQuests, requiredQuest]
      }
    }
    setRequiredIncompleteQuests(requiredIncompleteQuests)
  }, [requiredQuests])

  useEffect(() => {
    let totalPercentCorrect: number = 0
    for (let gradedQuiz of quest.completedQuizzes) {
      totalPercentCorrect += gradedQuiz.gradePercent
    }
    let avgPercentCorrect: number = totalPercentCorrect / quest.completedQuizzes.length
    let xpReward: number = Math.floor(avgPercentCorrect * quest.automaticXpReward)
    setTotalPercentCorrect(totalPercentCorrect * 100);
    setXpReward(xpReward)
  }, [quest, quest.completedQuizzes, quest.automaticXpReward])

  function startQuiz(quiz: QuizModel) {
    setQuiz(quiz)
    setVisible(true)
  }

  function onSubmitCode() {
    codeForm
      .validateFields()
      .then(values => {
        dispatch(enterCode(
          quest.id,
          values.code
        ))
      })
      .catch(info => {
        console.log('Validate Failed:', info);
      });
  }

  return (
    <div className={adminView ? "quest-view-admin" : `quest-view__${state}`}>
      <h2 style={{display: "flex", justifyContent: "center"}}>
        <span style={{height: "100%"}}>{quest.name}</span>
        <span>{quest.complete && <Tag style={{marginLeft: "5px"}} color="success" icon={<CheckCircleOutlined />}>Complete</Tag>}</span>
        <span>{!quest.complete && <Tag style={{marginLeft: "5px"}} color="warning" icon={<ClockCircleOutlined />}>Incomplete</Tag>}</span>
        <span>{quest.automaticXpReward > 0 && (
          <Tooltip title={"Earn up to " + quest.automaticXpReward + " XP for completing this quest."}>
            <Tag icon={<StarOutlined />}>{quest.automaticXpReward} XP</Tag>
          </Tooltip>
        )}</span>
      </h2>
      {quest.description}
      <div style={{height: "50px"}} />
      {(quest.completeWithCode || quest.completeWithQuizzesAndCode) && (
        <div style={{display: "flex", justifyContent: "center"}}>
          <Form layout="inline" form={codeForm} onFinish={onSubmitCode}>
            <Form.Item label="Enter Code">
              <Form.Item
                name="code"
                rules={[{ required: true, message: "Enter code" }]}
              >
                <Input placeholder="code" />
              </Form.Item>
            </Form.Item>
            <Button htmlType="submit">Submit</Button>
          </Form>
        </div>
      )}
      <div style={{height: "50px"}} />
      {requiredIncompleteQuests.length === 0 && quest.incompleteQuizIds && quest.incompleteQuizIds.length > 0 && (
        <>
          <h4>You must take
            {quest.incompleteQuizIds.length === 1 && (<> a quiz </>)}
            {quest.incompleteQuizIds.length > 1 && (<> these quizzes </>)}
            to complete this quest:</h4>
          <div style={{display: "flex", justifyContent: "center"}}>
              {incompleteQuizzes.map((quiz) => (
                <>
                  {<span key={quiz.id} style={{marginLeft: "2px", marginRight: "2px"}}>
                    {quiz.locked && <Tooltip title="This quiz is locked. Please wait for Professor Ramsey to unlock it.">
                      <Button disabled>
                        <LockOutlined />{quiz.name} ({quiz.numQuestions} questions)
                      </Button>
                    </Tooltip>}
                    {!quiz.locked && quest.completeWithQuizzesAndCode && !quest.codeEnteredSuccessfully
                    && <Tooltip title="This quiz is locked. Please enter your code above to unlock it.">
                      <Button disabled>
                        <LockOutlined />{quiz.name} ({quiz.numQuestions} questions)
                      </Button>
                    </Tooltip>}
                    {!quiz.locked && (!quest.completeWithQuizzesAndCode || quest.codeEnteredSuccessfully)
                    && <Tooltip title={visible ? "Quiz in progress" : "Click to start this quiz."}>
                      <Button disabled={visible} onClick={() => startQuiz(quiz)}>
                        {quiz.name} ({quiz.numQuestions} questions)
                      </Button>
                    </Tooltip>}
                  </span>}
                </>
              ))}
          </div>
        </>
      )}
      {quest.completedQuizzes && quest.completedQuizzes.length !== 0 && (!quest.incompleteQuizIds || quest.incompleteQuizIds.length === 0) && (
        <>
          <h3>Quiz score: {totalPercentCorrect.toFixed(2)}%</h3>
          {quest.complete && <h3>XP Reward: {xpReward}/{quest.automaticXpReward}</h3>}
        </>
      )}
      {quest.completedQuizzes && quest.completedQuizzes.length !== 0 && (
        <>
          <h4>Your quiz results are now available:</h4>
          {quest.completedQuizzes.map((quiz, i) => (
            <div key={quiz.id}>
              <Collapse style={{width: "100%"}}>
                <Collapse.Panel header={quiz.name} key={i}>
                  <Form
                    layout="vertical"
                    name="viewQuizForm"
                  >
                    {quiz.questions.map((question) => (
                      <div key={question.id}>
                        <div>
                          {question.question}
                        </div>
                        <br />
                        <div style={{display: "flex", justifyContent: "center"}}>
                          <div>
                            {question.answerOptions.map((answer) => (
                              <div key={answer.id + "answer"} style={{display: "flex", flexDirection: "row", justifyContent: "center"}}>
                                <div style={{ display: "block", height: "30px", lineHeight: "30px" }}>
                                  <span>{answer.correct && <Tag style={{marginLeft: "5px"}} color="success" icon={<CheckCircleOutlined />}>Correct Answer</Tag>}</span>
                                  <span>{!answer.correct && question.studentAnswerId === answer.id && <Tag style={{marginLeft: "5px"}} color="error" icon={<ExclamationCircleOutlined />}>Your Answer</Tag>}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                          <Radio.Group disabled>
                            {question.answerOptions.map((answer,) => (
                              <div key={answer.id} style={{display: "flex", flexDirection: "row", justifyContent: "center"}}>
                                <Radio style={{ display: "block", height: "30px", lineHeight: "30px" }}
                                       checked={answer.correct}
                                       value={answer.id}
                                >
                                  {answer.answer}
                                </Radio>
                              </div>
                            ))}
                          </Radio.Group>
                        </div>
                      </div>
                    ))}
                  </Form>
                  <br />
                  <br />
                </Collapse.Panel>
              </Collapse>
            </div>
          ))}
        </>
      )}
      {requiredIncompleteQuests.length > 0 && (
        <>
          {requiredIncompleteQuests.length === 1
            ? <h4>You must complete another quest before you can embark on this one:</h4>
            : <h4>You must complete the following quests before you can embark on this one:</h4>}
          {requiredIncompleteQuests.map((requiredQuest) => (
            <span key={requiredQuest.id}>{requiredQuest.name}</span>
          ))}
        </>
      )}
      <div style={{height: "30px"}} />
      {visible && <TakeQuiz questId={quest.id} quiz={quiz} endQuiz={() => setVisible(false)} />}
    </div>
  )
}

interface TakeQuizProps {
  questId: string
  quiz: QuizModel
  endQuiz: Function
}
export const TakeQuiz = ({ questId, quiz, endQuiz }: TakeQuizProps) => {
  const dispatch = useDispatch()
  const [form] = useForm()
  const [answerModels, setAnswerModels] = useState([] as AnswerModel[])

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    for (let question of quiz.questionBank) {
      if (!question.answerOptions || question.answerOptions.length === 0) continue
      setAnswerModels([...answerModels, { questionId: question.id, answerId: question.answerOptions[0].id }])
    }
  }, [quiz.questionBank])

  function onSubmitQuiz(values: any) {
    dispatch(gradeQuiz(questId, quiz.id, answerModels))
    endQuiz()
  }

  function onChangeAnswer(questionId: string, e: RadioChangeEvent) {
    for (const answerModel of answerModels) {
      if (answerModel.questionId === questionId) {
        answerModel.answerId = e.target.value
        return
      }
    }
    setAnswerModels([...answerModels, { questionId, answerId: e.target.value }])
  }

  return (
    <>
      <h2>{quiz.name}</h2>
      <Form
        form={form}
        layout="vertical"
        name="takeQuizForm"
        onFinish={onSubmitQuiz}
      >
        {quiz.questionBank.map((question,) => (
          <div key={question.id}>
            <Form.Item>
              {question.question}
              <br />
              <Radio.Group onChange={(e) => onChangeAnswer(question.id, e)}>
                {question.answerOptions.map((answer) => (
                  <Radio style={{ display: "block", height: "30px", lineHeight: "30px" }}
                         value={answer.id}
                         key={answer.id}
                  >
                    {answer.answer}
                  </Radio>
                ))}
              </Radio.Group>
            </Form.Item>
          </div>
        ))}

        <Button htmlType="submit" type="primary">Submit Quiz</Button>
      </Form>
      <br />
      <br />
    </>
  )
}
