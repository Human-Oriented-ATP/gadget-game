
r(1,2).
r(1,3).
r(xr(A),A).
g(A,B) :- g(B,A).
g(A,C) :- r(A,B), r(B,C).
r(A,C) :- g(A,B), g(B,C).
:- r(2,3).