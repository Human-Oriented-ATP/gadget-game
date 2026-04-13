"use client"

import { RefObject, useEffect, useRef } from "react"

const SCROLL_ANCHOR_SELECTOR = "[data-scroll-anchor]"

function getScrollAnchorStorageKey(scope: string) {
    return `scroll-anchor:${encodeURIComponent(scope)}`
}

function getClosestAnchorToTop(container: HTMLElement): string | undefined {
    const containerTop = container.getBoundingClientRect().top
    const anchors = container.querySelectorAll<HTMLElement>(SCROLL_ANCHOR_SELECTOR)

    let closestAnchor: string | undefined = undefined
    let smallestDistance = Number.POSITIVE_INFINITY

    for (const anchor of anchors) {
        const anchorName = anchor.dataset.scrollAnchor
        if (anchorName === undefined) {
            continue
        }

        const distanceToTop = Math.abs(anchor.getBoundingClientRect().top - containerTop)
        if (distanceToTop < smallestDistance) {
            closestAnchor = anchorName
            smallestDistance = distanceToTop
        }
    }

    return closestAnchor
}

function findAnchorElement(container: HTMLElement, anchorName: string): HTMLElement | undefined {
    const anchors = container.querySelectorAll<HTMLElement>(SCROLL_ANCHOR_SELECTOR)
    for (const anchor of anchors) {
        if (anchor.dataset.scrollAnchor === anchorName) {
            return anchor
        }
    }

    return undefined
}

export function useScrollAnchorPersistence(scope: string): RefObject<HTMLElement | null> {
    const scrollContainerRef = useRef<HTMLElement | null>(null)

    useEffect(() => {
        const container = scrollContainerRef.current
        if (container === null) {
            return
        }

        const storageKey = getScrollAnchorStorageKey(scope)
        const persistedAnchor = sessionStorage.getItem(storageKey)

        if (persistedAnchor !== null) {
            const element = findAnchorElement(container, persistedAnchor)
            element?.scrollIntoView({ block: "start", inline: "nearest" })
        }

        let frameId: number | undefined = undefined

        const saveNearestAnchor = () => {
            if (frameId !== undefined) {
                return
            }

            frameId = requestAnimationFrame(() => {
                frameId = undefined
                const closestAnchor = getClosestAnchorToTop(container)
                if (closestAnchor !== undefined) {
                    sessionStorage.setItem(storageKey, closestAnchor)
                }
            })
        }

        container.addEventListener("scroll", saveNearestAnchor, { passive: true })
        saveNearestAnchor()

        return () => {
            container.removeEventListener("scroll", saveNearestAnchor)
            if (frameId !== undefined) {
                cancelAnimationFrame(frameId)
            }
        }
    }, [scope])

    return scrollContainerRef
}
