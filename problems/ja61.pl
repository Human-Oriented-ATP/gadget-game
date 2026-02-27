r(1,2,3,4).

r(A,B,C,D) :- r(B,A,C,D).
r(A,B,C,D) :- r(A,C,D,B).

:- r(1,2,4,3).
