import React, { ReactElement, useState } from "react"

import { Button, Form, Input, message, Modal, Steps } from "antd"

import "./HeroCouncilIntro.css"
import { useDispatch } from "react-redux"
import { enterCodeForGrandChallenge } from "../../features/heroCouncilSlice"
import { UserModel } from "../../api/userAPI"
import TextArea from "antd/es/input/TextArea"
import { setIdeas } from "../../features/userSlice"

interface HeroCouncilIntroProps {
  visible: boolean
  setVisible: any
  user: UserModel
}
export const HeroCouncilIntro = ({ visible, setVisible, user }: HeroCouncilIntroProps) => {
  const dispatch = useDispatch()
  const [codeForm] = Form.useForm()
  const [ideasForm] = Form.useForm()
  const [currentStep, setCurrentStep] = useState(0)
  const [code, setCode] = useState(user.grandChallengeCode)

  function onChangeCode(e: React.ChangeEvent<HTMLInputElement>) {
    setCode(e.target.value)
  }

  function next() {
    if (currentStep === 0) {
      setCurrentStep(1)
    } else if (currentStep === 1) {
      onSubmitCode()
    }
  }

  function onSubmitCode() {
    codeForm
      .validateFields()
      .then(values => {
        dispatch(enterCodeForGrandChallenge(values.code, () => {setCurrentStep(currentStep + 1)}))
      })
      .catch(info => {
        console.log('Validating hero council code failed:', info);
      })
  }

  function onSubmitIdeas() {
    ideasForm
      .validateFields()
      .then(values => {
        dispatch(setIdeas(values.idea1, values.idea2, values.idea3, onComplete))
      })
      .catch(info => {
        console.log('Validating hero council code failed:', info);
      })
  }

  function onComplete() {
    setVisible(false)
    message.success("Completed intro")
  }

  const steps: {title: string, html: ReactElement}[] = [
    {
      title: 'Follow Intro',
      html: (
        <>
          Follow <a target="_blank" rel="noopener noreferrer" href="https://www.inklewriter.com/stories/6300" style={{color: "#1890ff", cursor: "pointer"}}>this short introduction</a> to obtain a code for the Grand Challenge you wish to tackle.
        </>
      )
    },
    {
      title: 'Enter Code',
      html: (
        <>
          <div style={{width: "100%", display: "flex", justifyContent: "center"}}>
            <Form form={codeForm} style={{width: "100%"}} size="large" initialValues={{code: code}}>
              <Form.Item
                style={{width: "100%"}}
                name="code"
                rules={[{ required: true, message: "Please enter a code for your desired Grand Challenge." }]}
                validateTrigger="onSubmit"
              >
                <Input style={{width: "35%"}} placeholder="code" />
              </Form.Item>
            </Form>
          </div>
        </>
      )
    },
    {
      title: 'Submit Solution Ideas',
      html: (
        <>
          {user.grandChallengeCategory && (
            <>
              Enter 3 podcast topic ideas that fall under the Grand Challenge category of {user.grandChallengeCategory}.
              <Form
                form={ideasForm}
                hideRequiredMark={true}
                colon={false}
                initialValues={{
                  idea1: user.idea1,
                  idea2: user.idea2,
                  idea3: user.idea3
                }}
              >
                <Form.Item
                  style={{width: "100%"}}
                  name="idea1"
                  rules={[{ required: true, message: "Please enter an idea." }]}
                >
                  <TextArea style={{width: "35%"}} placeholder="First idea" />
                </Form.Item>
                <Form.Item
                  style={{width: "100%"}}
                  name="idea2"
                  rules={[{ required: true, message: "Please enter an idea." }]}
                >
                  <TextArea style={{width: "35%"}} placeholder="Second idea" />
                </Form.Item>
                <Form.Item
                  style={{width: "100%"}}
                  name="idea3"
                  rules={[{ required: true, message: "Please enter an idea." }]}
                >
                  <TextArea style={{width: "35%"}} placeholder="Third idea" />
                </Form.Item>
              </Form>
            </>
          )}
          {!user.grandChallengeCategory && <>Please return to step 2 and enter a valid code for a category of Grand Challenges.</>}
        </>
      )
    }
  ];

  return (
    <Modal
      width="40%"
      visible={visible}
      onCancel={() => setVisible(false)}
      footer={(
        <div>
          {currentStep > 0 && (
            <Button style={{ margin: '0 8px' }} onClick={() => setCurrentStep(currentStep - 1)}>
              Previous
            </Button>
          )}
          {currentStep < steps.length - 1 && (
            <Button type="primary" onClick={next}>
              Next
            </Button>
          )}
          {currentStep === steps.length - 1 && (
            <Button type="primary" onClick={onSubmitIdeas}>
              Done
            </Button>
          )}
        </div>
      )}
    >
      <div className="steps-header">
        <Steps labelPlacement="vertical" current={currentStep} onChange={(currentStep => setCurrentStep(currentStep))}>
          {steps.map(item => (
            <Steps.Step key={item.title} title={item.title} />
          ))}
        </Steps>
      </div>
      <div className="steps-content">{steps[currentStep].html}</div>
    </Modal>
  )
}