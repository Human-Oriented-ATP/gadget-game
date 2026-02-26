r(1,2,3,4).

r(A,B,C,D) :- r(B,C,D,A).
r(A,B,C,D) :- r(A,C,D,B).

:- r(4,3,2,1).
