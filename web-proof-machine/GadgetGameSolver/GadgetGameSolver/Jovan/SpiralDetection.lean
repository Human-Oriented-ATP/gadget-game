import GadgetGameSolver.Jovan.Generalize
import GadgetGameSolver.Jovan.UnifySequence
/-!

To detect spirals, we loop through all ways of getting to the new goal.
As we do this, we keep track of the generalized proof.
At each point, we check if the new goal can be created from the past goal.

examples:
`g(a,1) :- g(b,a)` loops
`g(b,a) :- g(a,1)` similarly loops, and after 1 iteration, it gets to
  `g(b,1) :- g(1,1)`. But we could already see this looping from the start.
`g(a,b) :- g(b,a)` also loops, but we don't want to flag it as loopy immediately.

For now, we only check for spirals, which is defined so that the implication
can be repeatedly applied, and it creates new constants.


So I will stop a goal if every search path leading to it is spiralling.

What about loopy waiters? I will ignore them to avoid infite loops during
this search.

-/

namespace JovanGadgetGame
-- #exit
/-- starts at `none`, progresses to `some n`, and then to being removed.
A succesfull match is with a `some n` when the depth is more than `n`. -/
private abbrev IsSpiralState := Std.HashMap MVarId (Option Nat)

/--
A DFS implementation that tells whether there is a cycle in the assignments
with at least one non-trivial edge.
-/
partial def isSpiralingAssignment (mvars : Std.HashSet MVarId) : SearchM Bool := do
  let list := mvars.toList
  let s := mvars.inner.map fun _ _ => (none : Option Nat)
  let result ← (list.foldlM (go 0) s).run
  return result.isNone
where
  go (depth : Nat) (s : IsSpiralState) (mvarId : MVarId) : OptionT SearchM IsSpiralState := do
    match s[mvarId]? with
    | none => return s
    | some none =>
      let s := s.insert mvarId depth
      let some e ← mvarId.getAssignment? | throwThe _ "unassigned metavariable after `unifyLeft`"
      let s ← do
        if let .mvar mvarId := e then
          go depth s mvarId
        else
          let depth := depth + 1
          (e.collectMVars {}).result.foldM (go depth) s
      return s.erase mvarId
    | some (some depth') =>
      if depth = depth' then
        return s
      else
        failure

@[specialize]
def Expr.findMVar? (e : Expr) (p : MVarId → Bool) : Option MVarId :=
  match e with
  | .mvar mvarId =>
    if p mvarId then mvarId else none
  | .app _ args =>
    args.attach.toList.firstM fun ⟨arg, _⟩ => arg.findMVar? p

@[specialize]
def Cell.findMVar? (c : Cell) (p : MVarId → Bool) : Option MVarId :=
  c.args.toList.firstM (·.findMVar? p)

partial def isSpiral (cNode : ConsumerNode) : SearchM Bool :=
  withMCtx {} do
  let (origGoal, nextGoal) ← generalizeImplication cNode.proof cNode.nextSubgoalId
  go cNode.key origGoal nextGoal
where
  go (key : CellKey) (origGoal goal : Cell) : SearchM Bool := do
    let goal ← goal.instantiateMVars
    let origGoal ← origGoal.instantiateMVars
    let mctx ← getMCtx
    let mvarIds := (goal.collectMVars {}).result
    if mvarIds.isEmpty || (origGoal.findMVar? (mvarIds.contains)).isNone then
      return false
    if ← unifyLeft goal origGoal then
      let r ← isSpiralingAssignment mvarIds
      setMCtx mctx
      return r
    else
      let { waiters, .. } ← getEntry key
      waiters.allM fun
      | .root               => pure false
      | .consumerNode cNode => do
        setMCtx mctx
        let (goal', nextGoal) ← generalizeImplication cNode.proof cNode.nextSubgoalId
        unless ← unify goal' goal do
          throw s!"goals {← goal.toString} and {← goal'.toString} don't unify"
        go cNode.key origGoal nextGoal



/-

To detect whether an implication causes a loop, we need to find out if the gadget can be applied to itself infinitely many times.

To do this, we can imagine making `ℤ` freshly instantiated copies of the same gadget, and unifying them all at once.
To differentiate the different metavariables, we give each of them an offset value in `ℤ`.

This unification partially violated the occurs check. Thus we carefully mark for each variable whether it is recursive,
and if this recursion loops up or down, and whether the recursion contains any constants (if not, then it could loop
either up or down. In that case we let it loop down by default.)
We don't instantiate any metavariables.

-/
