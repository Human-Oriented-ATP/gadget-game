g(1,2,3).
g(2,3,1).
g(3,1,2).
r(4,5).
g(5,1,1).
g(6,2,1).
r(xr(A),A).
g(xg(A,B),A,B).
r(A,B) :- r(B,A).
g(A,4,A).
g(A,A,4).
g(C,A,B) :- r(C,E), r(A,D), g(E,D,B).
g(C,A,B) :- r(C,E), r(B,D), g(E,A,D).
g(E,A,F) :- g(D,A,B), g(E,D,C), g(F,B,C).
g(E,D,C) :- g(D,A,B), g(E,A,F), g(F,B,C).
r(A,B) :- g(A,5,B).
g(A,5,B) :- r(A,B).
r(A,B) :- g(A,B,5).
g(A,B,5) :- r(A,B). 
:- r(3,6).