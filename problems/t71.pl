r(1,4).
r(2,5).
r(3,6).
r(A,xr(A)).
r(A,C) :- r(A,B), r(B,C).
r(5,A) :- r(4,A).
r(6,A) :- r(5,A).
r(4,A) :- r(6,A).
g(A,B,C) :- r(A,D), r(B,D), r(C,D).
:- g(1,2,3).