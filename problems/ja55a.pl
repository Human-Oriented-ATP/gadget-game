g(4,1,2).
g(5,4,3).
g(6,1,3).
g(7,6,2).
g(8,2,3).
g(9,3,2).
g(E,A,F) :- g(D,A,B), g(E,D,C), g(F,B,C).
g(E,D,C) :- g(D,A,B), g(E,A,F), g(F,B,C).
r(A,B) :- g(A,C,D), g(B,C,E).
:- r(5,7).
