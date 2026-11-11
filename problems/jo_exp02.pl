r(X, f(X)).
r(A, B) :- r(B, A).
r(A, C) :- r(A, B), r(B, C).
:- r(1, 1).
