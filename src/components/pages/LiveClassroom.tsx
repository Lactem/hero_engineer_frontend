import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"

import { Button, Form, Collapse, Empty } from "antd"
import { useForm } from "antd/es/form/Form"

import { RootState } from "../../app/rootReducer"

import {
  loadActiveShortAnswerAssignment,
  saveGradedShortAnswerAssignment
} from "../../features/shortAnswerAssignmentsSlice"
import { LoadingOutlined } from "@ant-design/icons/lib"

import "./LiveClassroom.scss"
import TextArea from "antd/es/input/TextArea"
import {
  GradedShortAnswerAssignmentModel,
  GradedShortAnswerQuestionModel,
  ShortAnswerAssignmentModel
} from "../../api/shortAnswerAssignmentsAPI"

export const LiveClassroom = () => {
  const dispatch = useDispatch()
  const [firstLoad, setFirstLoad] = useState(true);
  const { user, userError } = useSelector(
    (state: RootState) => state.user
  )
  const { activeAssignment, activeAssignmentLoading, activeAssignmentError } = useSelector(
    (state: RootState) => state.shortAnswerAssignments
  )
  useEffect(() => {
    const timer = setInterval(() => {
      if (!activeAssignmentLoading) {
        dispatch(loadActiveShortAnswerAssignment())
      }
      setFirstLoad(false)
    }, firstLoad ? 0 : 5000);
    return () => clearTimeout(timer);
  })

  let activeAssignmentDom = null;

  if (activeAssignment) {
    activeAssignmentDom = <DoAssignment assignment={activeAssignment} />
  } else {
    if (activeAssignmentError) {
      activeAssignmentDom = (
        <div style={{textAlign: "center", color: "red"}}>
          {activeAssignmentError}
        </div>
      )
    } else if (firstLoad && activeAssignmentLoading) {
      activeAssignmentDom = <LoadingOutlined />
    } else {
      activeAssignmentDom = <Empty style={{marginTop: "50px"}} description={<>No in-class assignment is available at this time</>} />
    }
  }

  return (
    <>
      {activeAssignmentDom}
      <br />
      {user && user.gradedShortAnswerAssignments && <ViewGradedAssignments assignments={user.gradedShortAnswerAssignments} />}
    </>
  )
}

interface DoAssignmentProps {
  assignment: ShortAnswerAssignmentModel
}
export const DoAssignment = ({ assignment }: DoAssignmentProps) => {
  const dispatch = useDispatch()
  const [form] = useForm()
  const [gradedQuestions, setGradedQuestions] = useState<GradedShortAnswerQuestionModel[]>([]);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    for (let question of assignment.questions) {
      if (!question.question) continue
      setGradedQuestions([...gradedQuestions, { id: question.id, question: question.question, answer: "" }])
    }
  }, [assignment])

  function onSubmitAssignment(values: any) {
    dispatch(saveGradedShortAnswerAssignment(
      assignment.id,
      assignment.name,
      gradedQuestions,
      false,
      false,
      0,
      assignment.maxXp,
      "",
      false
    ))
    setLoadingSubmit(true)
  }

  function onChangeAnswer(questionId: string, e: React.ChangeEvent<HTMLTextAreaElement>) {
    let question = ""
    for (const gradedQuestion of gradedQuestions) {
      if (gradedQuestion.id === questionId) {
        question = gradedQuestion.question
        gradedQuestion.answer = e.target.value
        return
      }
    }
    setGradedQuestions([...gradedQuestions, { id: questionId, question, answer: e.target.value }])
  }

  return (
    <div className="active-assignment-view">
      <h1 style={{display: "flex", justifyContent: "center"}}>
        {assignment.name}
      </h1>

      <Form
        form={form}
        layout="vertical"
        name="shortAnswerAssignmentForm"
        onFinish={onSubmitAssignment}
        style={{ width: "50%" }}
      >
        {assignment.questions.map((question, i) => (
          <div key={question.id}>
            <Form.Item>
              {i + 1}. {question.question}
              <br />
              <TextArea onChange={(e) => onChangeAnswer(question.id, e)} />
            </Form.Item>
          </div>
        ))}

        <Button disabled={loadingSubmit} htmlType="submit" type="primary">
          Submit{loadingSubmit ? <LoadingOutlined /> : <></>}
        </Button>
      </Form>
    </div>
  )
}

interface ViewGradedAssignmentsProps {
  assignments: GradedShortAnswerAssignmentModel[]
}
const ViewGradedAssignments = ({ assignments }: ViewGradedAssignmentsProps) => {
  return (
    <div className="graded-assignments-view">
      <h1 style={{display: "flex", justifyContent: "center"}}>
        Graded Assignments
      </h1>
      <br /><br />
      <Collapse style={{width: "100%"}}>
        {assignments.filter(assignment => assignment.graded && assignment.available).map((assignment) => (
            <Collapse.Panel header={assignment.name} key={assignment.id}>
              XP Awarded: {assignment.xpAwarded}/{assignment.maxXp}
              <br />
              {assignment.feedback && (
                <>
                  Instructor Feedback:
                  <TextArea disabled={true} value={assignment.feedback} />
                </>
              )}
              <br /><br />
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
    </div>
  )
}
