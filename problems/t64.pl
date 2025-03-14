g(1,2,3).
g(2,3,1).
g(3,1,2).
g(4,1,1).
g(5,3,2).
g(6,5,1).
r(xr(A),A).
r(A,B) :- r(B,A).
g(A,4,B) :- g(A,B,4).
g(A,B,4) :- g(A,4,B).
g(xg(A,B),A,B).
g(E,A,F) :- g(D,A,B), g(E,D,C), g(F,B,C).
g(E,D,C) :- g(D,A,B), g(E,A,F), g(F,B,C).
r(A,B) :- g(A,4,B).
g(A,4,B) :- r(A,B).
r(A,B) :- g(A,B,4).
g(A,B,4) :- r(A,B). 
:- g(1,6,1).