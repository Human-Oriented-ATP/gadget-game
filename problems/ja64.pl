r(1,2,3,4,5).

r(A,B,C,D,E) :- r(B,C,A,D,E).
r(A,B,C,D,E) :- r(C,B,D,A,E).
r(A,B,C,D,E) :- r(D,B,C,E,A).

:- r(5,4,3,2,1).
