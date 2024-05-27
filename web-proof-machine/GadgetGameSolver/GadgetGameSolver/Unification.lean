import Lean
import GadgetGameSolver.Primitives

namespace GadgetGame

open Lean Meta

abbrev VarAssignmentCtx := PersistentHashMap String Term

variable [Monad M] [MonadStateOf VarAssignmentCtx M] [MonadFinally M] [MonadBacktrack VarAssignmentCtx M]

partial def Term.instantiateVars (t : Term) : M Term := do
  let ctx ← getThe VarAssignmentCtx
  match t with
  | .var v =>
    match ctx.find? v with
    | .some s => return s -- this assumes the context is up-to-date
    | .none => return .var v
  | .app f args => .app f <$> args.mapM instantiateVars

def Axiom.instantiateVars («axiom» : Axiom) : M Axiom := do
  return {
    hypotheses := ← «axiom».hypotheses.mapM Term.instantiateVars
    conclusion := ← «axiom».conclusion.instantiateVars
  }

def assign (var : String) (t : Term) : ExceptT String M Unit := do
  let ctx ← getThe VarAssignmentCtx
  let t ← t.instantiateVars
  unless ! t.containsVar? var do
    throw "Occur check failed."
  match ctx.find? var with
  | .some s =>
    unless Term.isEq s t do
      throw "Inconsistent assignment."
  | none => do
    let ctx' := ctx.map <| Term.substitute var t
    set <| ctx'.insert var t

partial def Term.unify (s t : Term) : ExceptT String M Unit := do
  match s, t with
  | .var v, t =>
    match (← getThe VarAssignmentCtx).find? v with
    | .some s => unify s t
    | none => assign v t
  | s, .var v =>
    match (← getThe VarAssignmentCtx).find? v with
    | .some t => unify s t
    | none => assign v s
  | .app f args, .app f' args' =>
    unless f = f' do
      throw "Function arguments {f} and {f'} do not match."
    unless args.size = args'.size do
      throw "The number of arguments does not match."
    for (arg, arg') in Array.zip args args' do
      unify arg arg'

def Term.unifiable? (s t : Term) : M Bool := withoutModifyingState do
  return (← unify s t |>.run).toBool

def Axiom.instantiateFresh (extension : String) («axiom» : Axiom) : M Axiom := do
  let freshVarCtx : PersistentHashMap String Term := «axiom».collectVarsDedup.foldl (init := .empty)
    fun ctx v ↦ ctx.insert v (.var <| modify v)
  withoutModifyingState do
    set freshVarCtx
    «axiom».instantiateVars
where
  modify : String → String := (· ++ "_" ++ extension)

end GadgetGame
