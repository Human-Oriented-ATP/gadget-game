
r(5,1,2).
r(6,5,3).
r(7,6,4).
r(8,3,4).
r(9,2,8).
r(xr(A,B),A,B).
r(E,A,F) :- r(D,A,B), r(E,D,C), r(F,B,C).
r(E,D,C) :- r(D,A,B), r(F,B,C), r(E,A,F).
:- r(7,1,9).

