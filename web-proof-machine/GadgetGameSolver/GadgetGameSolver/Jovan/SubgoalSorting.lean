import GadgetGameSolver.Jovan.ProofTree
import GadgetGameSolver.Jovan.Basic
import Lean
/-!
when choosing the next subgoal in a consumer node, we want to do so wisely.
- A goal that has at most 1 applicable axiom is the best

- A goal that has less metavariables is better

- A goal that has less applicable axioms,
  and ones that introduce fewer metavariables and fewer new subgoals is better.


OHHH wait, very important/confusing is the fact that subgoals of subgoals don't get propagated to the
higher lever, which disturbs the ability to choose the best of the available goals.
The problem is that a priori, this subgoal may be shared with others.

In fact, there is currently no way to work on different goals at the same time, because the solutions to
goals are only propagated when they are complete :(
The problem is that if you do some progress on one goal, then the other goal may just become a different
goal (with instantiated metavariables), effectively deleting the progress on the more general goal.


Let's define a cost function for axiom applications:
- need a cost function for how specific or unspecific a goal is.
- need a way to combine this over multiple parallel goals.
- need a way to combine this over multiple possible axioms.

The cost should be a general estimation of how hard the search is. So,
- combining over multiple axioms should be done with addition.
- combining over muliple parallel goals, assuming they don't share metavariables,
  should be done with addition if there is a solution, and less-than-addition if
  one of the goals doesn't have a solution.
  If they share metavariables, then it is also less-than addition due to the fact that later goals
  become easier. However on the other hand, this should be multiplication, since we need to consider
  all possible goals, and combine them in all possible ways.
  The issue is that we can do optimizations when the metavariables are not shared.

This function will recursively try axioms that are uniquely applicable, and only create 1 goal,
and never repeat the same axiom. With this, the goal may be solved, or the whole node may be discarded.



-/

namespace JovanGadgetGame
open GadgetGame

def specificity : Term → Float
| .var _ => 0
| .app _ args => if args.isEmpty then 1 else
  let argSpec := args.attach.foldl (init := 0) (fun spec ⟨x, _⟩ => spec + specificity x) / args.size.toFloat
  (1 + argSpec) / 2

/-- difficulty of a goal. (since it is a goal, it isn't a metavariable) -/
def difficulty : Term → Float := (1 / specificity ·)

/-- Returns `none` if `ax` doesn't work. Returns the difficulty -/
def checkAxiom (goal : Term) (ax : Axiom) : SearchM (Option (Axiom × Float)) := do
  let ax := AxiomInstantiateFresh (toString (← getUnique)) ax
  let mctx ← getThe MetavarContext
  if ← unify ax.conclusion goal then
    if ax.hypotheses.isEmpty then
      set mctx
      return some (ax, 1/2)
    else
      let d ← ax.hypotheses.foldlM (init := 0) fun d subGoal => do
        let subGoal ← instantiateVars subGoal
        return d + (difficulty subGoal)
      set mctx
      return some (ax, d)
  else
   return none

structure AxiomApplication where

/-- Returns the difficulty of the goal, and the axioms sorted from difficult to easy. -/
def checkAxioms (goal : Term) : SearchM (Float × Array Axiom) := do
  let axioms ← getAxioms goal
  let filteredAxioms ← axioms.filterMapM (checkAxiom goal)
  let difficulty := filteredAxioms.foldl (init := 0) (· + ·.2)
  let filteredAxioms := filteredAxioms.qsort (·.2 > ·.2) |>.map (·.1)
  return (difficulty, filteredAxioms)

/--
Returns the easiest goal with its applicable axioms sorted from difficult to easy, and the remaining goals.
Returns `.error true` if there are no goals. Returns `.error false` if some goals can't be solved. -/
def bestSubgoal (goals : Array GoalId) : SearchM (Except Bool ((GoalId × Array Axiom) × Array GoalId)) := do
  let some goals ← OptionT.run <| goals.mapM fun goalId => do
    let goal ← goalId.getInstantiatedGoal
    let (difficulty, axioms) ← checkAxioms goal
    if axioms.isEmpty then
      failure
    else
      return (difficulty, goalId, axioms)
    | return .error false
  let some (_, goalId, axioms) := goals.getMax? (·.1 > ·.1) | return .error true
  let otherGoals := goals.filterMap fun (_, goalId', _) => if goalId' == goalId then none else some goalId'
  return .ok ((goalId, axioms), otherGoals)





inductive GoalSortingResult where
| goal (goal : GoalId) (goals : List GoalId) (cNode : ConsumerNode)
| solved (answer : Answer)
| none
