r(1,2).
r(1,3).
r(2,3).
g(xg(A,B),A,B).
g(A,B,C) :- g(A,B,D), g(A,C,D), g(B,C,D).
g(A,B,G) :- g(C,D,A), g(F,E,B), r(D,E,G).
:- g(4,5,6).