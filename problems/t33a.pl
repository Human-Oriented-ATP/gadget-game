g(2,1,1).
g(3,2,1).
g(4,3,1).
g(5,4,1).
g(E,A,F) :- g(D,A,B), g(E,D,C), g(F,B,C).
g(E,D,C) :- g(D,A,B), g(E,A,F), g(F,B,C).
:- g(5,1,4).

