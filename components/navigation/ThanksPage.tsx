"use client"

export function ThanksPage() {
    return (
        <div className="w-screen flex flex-col items-center text-center pt-10">
            <h1 className="text-2xl p-4">Thank you for your participation!</h1>
            <div className='text-justify max-w-(--breakpoint-lg) p-4'>
                <p className="p-2">You can use the following code to confirm your participation on Prolific.</p>

                <div className="flex flex-col items-center mt-4">
                    <div className="text-xl text-center font-mono bg-palette-gray p-4 w-48">C136DL0Z</div>
                </div>
            </div>
            <div className="absolute top-0 right-0 p-2 text-sm">Contact: kmc61@cam.ac.uk </div>
        </div>
    )
}