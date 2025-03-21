r(1,2).
r(1,3).
r(2,3).
g(xg(A,B),A,B).
g(A,B,C) :- r(A,B), r(A,C), r(B,C).
r(A,B) :- g(C,D,A), g(F,E,B), r(D,E).
:- g(4,5,6).