g(3,2,3).
g(A,A,1).
g(A,1,A).
g(xg(A,B),A,B).
r(xr(A),A).
r(A,B) :- r(B,A).
g(1,A,B) :- r(A,B).
r(A,B) :- g(1,A,B).
g(E,A,F) :- g(D,A,B), g(E,D,C), g(F,B,C).
g(E,D,C) :- g(D,A,B), g(E,A,F), g(F,B,C).
:- g(4,2,4).