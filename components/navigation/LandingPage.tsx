"use client"

import { StartButton } from "components/primitive/buttons/StartFirstUnsolvedLevel"
import { useRouter } from "next/navigation"
import { initializePlayerId, hasPlayerId } from "lib/study/playerId"
import { useTouchDevice } from "lib/util/useTouchDevice"
import { useEffect, useState } from "react"

export function LandingPage() {
  const router = useRouter();
  const isTouchDevice = useTouchDevice()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    const checkAndRedirect = async () => {
      const playerIdExists = await hasPlayerId()
      if (playerIdExists) {
        router.push('public-v0')
      } else {
        setIsChecking(false)
      }
    }
    checkAndRedirect()
  }, [router])

  const handleStart = async () => {
    await initializePlayerId();
    router.push('public-v0/game/tutorial01');
  }

  if (isChecking) {
    return null // or a loading spinner
  }

  return (
    <div className="w-full flex flex-col items-center text-center pt-10">
      {isTouchDevice && (
        <div className="max-w-(--breakpoint-lg) p-4 mb-4">
          <div className="bg-yellow-100 border-2 border-yellow-500 rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-4">⚠️ Sorry, we don&apos;t yet support touch devices!</h2>
            <p className="text-lg mb-4">
              We&apos;ve detected that you&apos;re using a touch device (phone or tablet).
            </p>
            <p className="text-base">
              The game is not currently compatible with touch devices and will not function properly. We&apos;re hoping to add support in the future, but for now, we recommend using a desktop or laptop computer to access the game.
            </p>
          </div>
        </div>
      )}
      
      <h1 className="text-2xl p-4">Welcome to our study!</h1>
      <div className='text-justify max-w-(--breakpoint-lg) p-4'>
        <p className="p-2">By completing this study, you are participating in a study being performed by researchers from the University of Cambridge. The purpose of this research is to study human reasoning about new problems, and the results will inform mathematics, cognitive science, and AI research.</p>

        <p className="p-2">You must be at least 18 years old to participate. There are neither specific benefits nor anticipated risks associated with participation in this study. Your participation in this study is completely voluntary and you can withdraw at any time by simply exiting the study. You may decline to answer any or all of the following questions. Choosing not to participate or withdrawing will result in no penalty. Your anonymity is assured; the researchers who have requested your participation will not receive any personal information about you, and any information you provide will not be shared in association with any personally identifying information. We may release anonymized gameplay on GitHub as part of open-source research; please do not participate unless you are okay with the gameplay traces being shared.</p>

        <p className="p-2">If you have questions about this research, please contact the researchers by sending an email to kmc61@cam.ac.uk. These researchers will do their best to communicate with you in a timely, professional, and courteous manner. If you have questions regarding your rights as a participant, or if problems arise which you do not feel you can discuss with the researchers, please contact the University of Cambridge Dept of Engineering Ethics Offices.</p>

        <p className="p-2">Your participation in this research is voluntary. You may discontinue participation at any time during the research activity. You may print a copy of this consent form for your records.</p>

        <p className="p-2 font-bold">Note that this study has been optimised for laptops and desktop computers and that participation is not possible from touch devices like phones or tablets.</p>
      </div>
      <div className="p-6">
        <div onClick={handleStart}>
          <StartButton />
        </div>
      </div>
      <div className="absolute top-0 right-0 p-2 text-sm">Contact: kmc61@cam.ac.uk </div>
    </div>
  )
}