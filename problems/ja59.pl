swapper.
r(1,3,4).
r(2,5,3).

eq(B,A) :- r(B,1,A).
eq(B,A) :- r(B,A,2).

r(xr(A,B),A,B).
r(E,A,F) :- r(D,A,B), r(E,D,C), r(F,B,C).
r(E,D,C) :- r(D,A,B), r(E,A,F), r(F,B,C).

:- eq(1,2).