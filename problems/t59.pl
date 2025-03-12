r(1,1).
r(2,4).
r(3,4).
g(xg(A,B),A,B).
g(1,A,A).
w(B,C) :- g(1,B,C).
g(1,B,C) :- w(B,C).
g(C,A,B) :- r(F,C), r(D,A), r(E,B), g(F,D,E).
:- w(2,3).