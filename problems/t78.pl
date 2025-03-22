
r(xr(A),A).
g(A,xr(A)).
r(A,B) :- g(A,B).
r(A,C) :- r(A,B), r(D,C).
:- r(1,1).