r(2,1).
r(3,2).
r(4,3).
r(7,6).
g(5,4,1).
g(6,2,1).
g(A,B,B) :- r(A,B).
g(D,E,F) :- g(A,B,C), r(D,A), r(E,B), r(F,C).
g(E,A,F) :- g(D,A,B), g(E,D,C), g(F,B,C).
g(E,D,C) :- g(D,A,B), g(E,A,F), g(F,B,C).
:- g(5,7,6).

