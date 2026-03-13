r(X, Y, f_r(X, Y)).

g(X, f_g(X)).

b(X, Y, C) :- r(X, Y, C), g(C, _).

p(A, B, C) :- r(A, B, C), b(1, 2, C).
p(A, B, C) :- r(B, A, C), b(1, 2, C).

:- p(2, 1, K).