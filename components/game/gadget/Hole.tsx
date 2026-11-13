import { useGameStateContext } from 'lib/state/StateContextProvider'
import type { MouseEvent } from 'react'
import { Term, VariableName } from 'lib/game/Term'
import { getAssignedValue } from 'lib/game/TermEnumeration'
import { StaticHole } from './StaticHole'
import { GameSlice } from 'lib/state/Store'
import { getIdentifier } from 'lib/game/HoleUnification'
import { SwapperHoleClickHandler } from './handles/ToggleableSwapperHandle'
import { GadgetId } from 'lib/game/Primitives'

interface HoleProps {
    term: Term
    gadgetId?: GadgetId
    variableName?: VariableName
    isToggled?: boolean
    onToggleSwapperHole?: SwapperHoleClickHandler
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
        const termLabel = getIdentifier(term);
        if (termLabel === undefined) return undefined;
        const termRepresentative = holeAssignment.findRepresentative(termLabel);

        const focussedRepresentative = focussedHole === undefined ? undefined
            : holeAssignment.findRepresentative(focussedHole);

        return {
            isFocussed: termRepresentative === focussedRepresentative, 
            onMouseEnter: () => focus(termLabel),
        }
    }

    const { onToggleSwapperHole, gadgetId, variableName, isToggled } = props;

    const onClick = onToggleSwapperHole && gadgetId !== undefined
        && variableName !== undefined && isToggled !== undefined
        ? (event: MouseEvent<HTMLDivElement>) => onToggleSwapperHole(event, gadgetId, variableName, !isToggled)
        : undefined;

    return <StaticHole value={value}
        isFunctionHole={"function" in props.term}
        isToggled={props.isToggled} onClick={onClick}
        {...makeFocusProps(props.term)}
        onMouseLeave={removeFocus}
    />
}