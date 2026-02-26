r(1,2,3,4,5,6).

r(A,B,C,D,E,F) :- r(B,A,C,D,E,F).
r(A,B,C,D,E,F) :- r(A,C,B,D,E,F).
r(A,B,C,D,E,F) :- r(A,B,D,C,E,F).
r(A,B,C,D,E,F) :- r(A,B,C,E,D,F).
r(A,B,C,D,E,F) :- r(A,B,C,D,F,E).

:- r(6,5,4,3,2,1).
