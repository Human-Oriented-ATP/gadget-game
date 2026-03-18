striped_r(X, Y, fsr(X, Y)).
striped_b(X, fsb(X)).

r(A, B, C) :- striped_r(A, B, C).
r(A, B, C) :- striped_r(B, A, C).

b(A, B) :- striped_b(A, X), striped_b(B, X).

w(A, B) :- r(A, B, C), r(B, A, D), b(C, D).

:- w(1, 2).