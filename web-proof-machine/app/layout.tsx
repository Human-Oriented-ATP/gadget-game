import { Metadata } from "next"
import "../index.css"
import { Analytics } from "@vercel/analytics/next"

export const metadata: Metadata = {
    title: 'Gadgets Game',
    description: '',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <html lang="en">
        <head>
            <link rel="icon" href="/favicon.ico" />
        </head>
        <body className="bg-light-gray">
            <noscript>You need to enable JavaScript to run this app.</noscript>
            <div id="root">{children}</div>
            <Analytics />
        </body>
    </html>
}