import Link from "next/link"

export default function PrivacyPolicyPage() {
    return <div className="p-6">
        <div className="mx-auto max-w-3xl space-y-6 text-justify">
            <h1 className="text-2xl font-semibold text-center">Privacy Policy</h1>
            <p>This page is a placeholder and the full privacy policy text will be added soon.</p>
            <Link
                href="/"
                className="block w-fit mx-auto border-2 border-black rounded-lg p-2.5 hover:bg-black hover:text-white"
            >
                Back to Home
            </Link>
        </div>
    </div>
}
