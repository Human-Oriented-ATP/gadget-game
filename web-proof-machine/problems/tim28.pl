r(2,1).
r(3,2).
r(4,3).
r(5,4).
r(7,6).
g(6,3,1).
g(8,7,6).
g(xg(A,B),A,B).
g(A,B,C) :- g(A,C,B).
g(A,B,B) :- r(A,B).
r(A,B) :- g(A,B,B).
g(D,E,F) :- g(A,B,C), r(D,A), r(E,B), r(F,C).
g(E,A,F) :- g(D,A,B), g(E,D,C), g(F,B,C).
g(E,D,C) :- g(D,A,B), g(E,A,F), g(F,B,C).
:- g(5,8,1).

