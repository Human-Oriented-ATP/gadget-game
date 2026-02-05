"use client"

import { StartButton } from "components/primitive/buttons/StartFirstUnsolvedLevel"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { initializePlayerId } from "lib/study/playerId"

function CheckItem(props: { setIsChecked: (checked: boolean) => void, children: React.ReactNode }) {
  return <div>
    <label>
      <input type="checkbox" className="mr-2" onChange={(event) => props.setIsChecked(event.target.checked)} />
      {props.children}
    </label>
  </div>
}

export function LandingPage() {
  const router = useRouter();
  const [check1, setCheck1] = useState(false)
  const [check2, setCheck2] = useState(false)
  const [check3, setCheck3] = useState(false)
  const [check4, setCheck4] = useState(false)

  const handleStart = async () => {
    await initializePlayerId();
    router.push('pilot-fwd-v2/game/tutorial01');
  }

  return (
    <div className="w-full flex flex-col items-center text-center pt-10">
      <h1 className="text-2xl p-4">Welcome to our study!</h1>
      <div className='text-justify max-w-(--breakpoint-lg) p-4'>
        <p className="p-2">By completing this study, you are participating in a study being performed by researchers from the University of Cambridge. The purpose of this research is to study human reasoning about new problems, and the results will inform mathematics, cognitive science, and AI research.</p>

        <p className="p-2">You must be at least 18 years old to participate. There are neither specific benefits nor anticipated risks associated with participation in this study. Your participation in this study is completely voluntary and you can withdraw at any time by simply exiting the study. You may decline to answer any or all of the following questions. Choosing not to participate or withdrawing will result in no penalty. Your anonymity is assured; the researchers who have requested your participation will not receive any personal information about you, and any information you provide will not be shared in association with any personally identifying information. We may release anonymized gameplay on GitHub as part of open-source research; please do not participate unless you are okay with the gameplay traces being shared.</p>

        <p className="p-2">If you have questions about this research, please contact the researchers by sending an email to kmc61@cam.ac.uk. These researchers will do their best to communicate with you in a timely, professional, and courteous manner. If you have questions regarding your rights as a participant, or if problems arise which you do not feel you can discuss with the researchers, please contact the University of Cambridge Dept of Engineering Ethics Offices.</p>

        <p className="p-2">Your participation in this research is voluntary. You may discontinue participation at any time during the research activity. You may print a copy of this consent form for your records.</p>

        <p className="p-2 font-bold">Note that this study has been optimised for laptops and desktop computers and that participation is not possible from touch devices like phones or tablets.</p>

        <p className="p-2">To continue, check the checkboxes below and click {"Start"}.</p>
      </div>
      <div className="text-left p-2">
        <CheckItem setIsChecked={setCheck1}>I am age 18 or older.</CheckItem>
        <CheckItem setIsChecked={setCheck2}>I have read and understand the information above.</CheckItem>
        <CheckItem setIsChecked={setCheck3}>I am not using a touch device.</CheckItem>
        <CheckItem setIsChecked={setCheck4}>I want to participate in this research and continue with the experiment.</CheckItem>
      </div>
      <div className="p-6">
        {check1 && check2 && check3 && check4 ?
          <div onClick={handleStart}>
            <StartButton />
          </div>
          : <StartButton className="border-2 border-black rounded-lg p-5 px-10 hover:bg-black hover:text-white text-2xl cursor-not-allowed bg-palette-gray opacity-40 " />}
      </div>
      <div className="absolute top-0 right-0 p-2 text-sm">Contact: kmc61@cam.ac.uk </div>
    </div>
  )
}