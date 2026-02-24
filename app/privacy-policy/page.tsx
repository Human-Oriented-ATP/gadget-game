import Link from "next/link"

export default function PrivacyPolicyPage() {
    return <div className="p-6 space-y-4">
        <h1 className="text-2xl font-semibold">Privacy Policy</h1>
        <p>This page is a placeholder and the full privacy policy text will be added soon.</p>
        <Link
            href="/"
            className="inline-block border-2 border-black rounded-lg p-2.5 hover:bg-black hover:text-white"
        >
            Back to main page
        </Link>
    </div>
}
