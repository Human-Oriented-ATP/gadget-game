import { useGameStateContext } from 'lib/state/StateContextProvider'
import { Term } from 'lib/game/Term'
import { getAssignedValue } from 'lib/game/TermEnumeration'
import { StaticHole } from './StaticHole'
import { GameSlice } from 'lib/state/Store'

interface HoleProps {
    term: Term
}

const selector = (state: GameSlice) => ({
    termEnumeration: state.termEnumeration,
    assignment: state.assignment,
    focussedHole: state.focussedHole,
    focus: state.focus,
    removeFocus: state.removeFocus
})

export function Hole(props: HoleProps) {
    const { termEnumeration, assignment, focussedHole, focus, removeFocus } = useGameStateContext(selector)

    const value = getAssignedValue(props.term, assignment, termEnumeration);

    // Make use of assigned values so that number terms share
    // the same representative as the holes they are unified with.
    const findRepresentativeWithNumbers = (term: Term) => {
        if ("function" in term) throw Error("Unreachable case");
        if ("number" in term) return term.label;

        const termValue = assignment.getAssignedValue(term.variable);
        if (termValue === undefined || !("number" in termValue)) 
            return assignment.findRepresentative(term.variable);
        return termValue.label;
    }

    const makeFocusProps = (term: Term) => {
        if ("function" in term) return undefined;

        const termRepresentative = findRepresentativeWithNumbers(term);
        const focussedRepresentative = focussedHole === undefined ? 
              undefined
            : findRepresentativeWithNumbers(focussedHole);

        return {
            isFocussed: termRepresentative === focussedRepresentative,
            onMouseEnter: () => focus(term),
        }
    }

    return <StaticHole value={value} isFunctionHole={"function" in props.term} {...makeFocusProps(props.term)} onMouseLeave={removeFocus} />
}