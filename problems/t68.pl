r(1,2).
b(3,1).
b(4,2).
g(xg(A,B),A,B).
r(A,C) :- r(A,B), r(B,C).
r(A,B) :- g(A,B,B).
r(D,E) :- g(D,A,C), g(E,B,C), r(A,B).
r(D,E) :- g(D,C,A), g(E,C,B), r(A,B).
:- r(3,4).