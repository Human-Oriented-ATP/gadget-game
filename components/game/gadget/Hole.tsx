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

    const makeFocusProps = (term: Term) => {
        if ("variable" in term) {
            return {
                isFocussed: focussedHole === term.variable,
                onMouseEnter: () => focus(term.variable),
            }
        } else {
            return undefined
        }
    }

    return <StaticHole value={value} isFunctionHole={"function" in props.term} {...makeFocusProps(props.term)} onMouseLeave={removeFocus} />
}