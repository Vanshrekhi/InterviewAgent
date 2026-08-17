import React from 'react'
import { useState } from 'react'
import Step1SetUp from '../components/Step1SetUp'
import Step2Interview from '../components/Step2Interview'
import Step3Report from '../components/Step3Report'

function loadSavedProgress() {
    try {
        const saved = localStorage.getItem("interviewProgress")
        if (saved) {
            return JSON.parse(saved)
        }
    } catch (error) {
        console.log(error)
    }
    return null
}

function InterviewPage() {
    const savedProgress = loadSavedProgress()

    const [step, setStep] = useState(savedProgress?.step || 1)
    const [interviewData, setInterviewData] = useState(savedProgress?.interviewData || null)

    const updateProgress = (newStep, newData) => {
        setStep(newStep)
        setInterviewData(newData)
        try {
            localStorage.setItem(
                "interviewProgress",
                JSON.stringify({ step: newStep, interviewData: newData })
            )
        } catch (error) {
            console.log(error)
        }
    }

    const clearProgress = () => {
        try {
            localStorage.removeItem("interviewProgress")
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className='min-h-screen bg-gray-50'>
            {step === 1 && (
                <Step1SetUp onStart={(data) => {
                    updateProgress(2, data)
                }} />
            )}

            {step === 2 && (
                <Step2Interview interviewData={interviewData}
                    onFinish={(report) => {
                        updateProgress(3, report)
                    }}
                />
            )}

            {step === 3 && (
                <Step3Report report={interviewData} onDone={clearProgress} />
            )}


        </div>
    )
}

export default InterviewPage