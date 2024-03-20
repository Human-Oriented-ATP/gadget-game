r(1,2,3,1,1).
r(1,2,4,1,1).
r(1,4,3,1,1).

r(xr(A,B,C,D),A,B,C,D).

r(A,B,C,D,E) :- r(A,B,C,1,1), r(1,D,E,1,1).
r(A,B,C,D,E) :- r(A,C,B,D,E).
r(A,B,C,D,E) :- r(A,C,D,E,B).
r(B,1,1,D,E) :- r(1,A,C,1,1), r(B,A,C,D,E).
g(A) :- r(1,A,1,1,1).
r(1,A,1,1,1) :- g(A).
r(1,A,B,1,1) :- r(1,A,A,B,B).

g(A,B) :- g(A), g(B).

:- g(2,3).