import Mathlib

-- Keep it simple: these definitions mean no problems with universes/decidability
abbrev Var := Nat
abbrev Func := String
abbrev Pred := String

def GadgetGameLanguage : FirstOrder.Language where
  Functions := fun _ ↦ String
  Relations := fun _ ↦ String

notation "𝓛" => GadgetGameLanguage

inductive Term where
  | var (v : Var)
  | app (f : Func) (t : List Term)

def Term.varSet : Term → Set Var
  | var v => {v}
  | app _ ts => (ts.map varSet).foldl Set.union ∅

def Term.toFOL : Term → FirstOrder.Language.Term 𝓛 Var
  | var v => FirstOrder.Language.Term.var v
  | app f t => let folTerms := t.map Term.toFOL
      FirstOrder.Language.Term.func (l := folTerms.length) f
      (λ n : Fin folTerms.length ↦ (folTerms.get n))


abbrev Equation := Term × Term

-- TODO: What is the right definition here?
-- Might model disjoint set data structure to mirror the game closely
abbrev Assignment := List (Var × Term)

open Term

-- Isabelle AFP entry for reference: https://isa-afp.org/thys/First_Order_Terms/Unification.html
partial def unify (eqs : List Equation) (asg : Assignment) : Option Assignment :=
  match eqs, asg with
  | [], a => a
  | ⟨app f1 t1, app f2 t2⟩ :: eqs, a =>
    if t1.length == t2.length && f1 == f2
      then unify (List.zip t1 t2 ++ eqs) a
    else none
  | ⟨var v, t⟩ :: eqs, a
  | ⟨t, var v⟩ :: eqs, a => sorry
-- todo: want terminating version!

abbrev Atom := Pred × List Term

def Atom.toFOL (a : Atom) : FirstOrder.Language.Formula 𝓛 Var :=
  let folTerms := a.2.map Term.toFOL
  FirstOrder.Language.Relations.formula (n := folTerms.length) a.1 folTerms.get

structure DefiniteClause where
  head : Atom
  body : List Atom

open FirstOrder.Language.BoundedFormula in
def iterateImp {α : Type*} {n : ℕ} {L : FirstOrder.Language} :
  List (FirstOrder.Language.BoundedFormula L α n) →
    (FirstOrder.Language.BoundedFormula L α n) → FirstOrder.Language.BoundedFormula L α n
  | [], hd => hd
  | x :: xs, hd => iterateImp xs (imp x hd)

open FirstOrder.Language.BoundedFormula in
def DefiniteClause.toFOL (c : DefiniteClause) : FirstOrder.Language.Formula 𝓛 Var :=
  iterateImp (c.body.map (Atom.toFOL)) c.head.toFOL

abbrev DefiniteProgram := List DefiniteClause

structure GadgetGame where
  program : DefiniteProgram
  goal : Atom

abbrev GadgetId := Nat -- can use the convention that 0 is the goal gadget

structure Connection where
  from_ : GadgetId
  to_ : GadgetId × Nat

def hasDirectedCycle (cs : List Connection) : Prop := sorry
-- TODO: think about how to do this elegantly

structure Diagram (gg : GadgetGame) where
  gadgets : List (GadgetId × DefiniteClause)
  connections : List Connection
  validClauses : ∀ g ∈ gadgets, g.2 ∈ gg.program
  noCycles : sorry

def isValid (gg : GadgetGame) (d : Diagram gg) : Prop :=
  -- let eqs := [];
  -- unify eqs emptyAssignment != none
  sorry

def solvable (gg : GadgetGame) : Prop := sorry
-- define in terms of FOL semantics as in Mathlib, potentially in Herbrand model (not in Mathlib)

-- The main equivalence to be shown:
example (gg : GadgetGame) : solvable gg ↔ (∃ d : Diagram gg, isValid gg d) :=
  sorry
