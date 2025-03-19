g(2,4,5).
g(2,6,3).
g(3,1,4).
g(5,1,6).
g(xg(A,B),A,B).
r(A,B) :- g(C,A,B), g(C,B,A).
g(A,B,C) :- g(A,D,E), g(B,D,F), g(E,F,C).
:- r(3,5).