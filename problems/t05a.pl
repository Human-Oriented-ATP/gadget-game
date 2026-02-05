g(3,1,2).
r(4,3).
r(5,1).
r(6,2).
g(A,7,A).
g(A,A,7).
r(B,A) :- r(A,B).
g(7,A,B) :- r(A,B).
g(E,A,F) :- g(D,A,B), g(E,D,C), g(F,B,C).
g(E,D,C) :- g(D,A,B), g(F,B,C), g(E,A,F).
:- g(4,6,5).