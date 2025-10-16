import { useGameStateContext } from 'lib/state/StateContextProvider'
import { Term } from 'lib/game/Term'
import { getAssignedValue } from 'lib/game/TermEnumeration'
import { StaticHole } from './StaticHole'
import { GameSlice } from 'lib/state/Store'
import { getLabel } from 'lib/game/HoleUnification'

interface HoleProps {
    term: Term
}

const selector = (state: GameSlice) => ({
    termEnumeration: state.termEnumeration,
    assignment: state.assignment,
    holeAssignment: state.holeAssignment,
    focussedHole: state.focussedHole,
    focus: state.focus,
    removeFocus: state.removeFocus
})

export function Hole(props: HoleProps) {
    const { termEnumeration, assignment, holeAssignment, focussedHole, focus, removeFocus } = useGameStateContext(selector)

    const value = getAssignedValue(props.term, assignment, termEnumeration);

    const makeFocusProps = (term: Term) => {
        const termLabel = getLabel(term);
        if (termLabel === undefined) return undefined;
        const termRepresentative = holeAssignment.findRepresentative(termLabel);

        const focussedRepresentative = focussedHole === undefined ? undefined
            : holeAssignment.findRepresentative(focussedHole);

        return {
            isFocussed: termRepresentative === focussedRepresentative, 
            onMouseEnter: () => focus(termLabel),
        }
    }

    return <StaticHole value={value} isFunctionHole={"function" in props.term} {...makeFocusProps(props.term)} onMouseLeave={removeFocus} />
}