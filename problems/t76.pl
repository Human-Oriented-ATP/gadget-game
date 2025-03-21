r(1,2).
r(3,4).
g(1,3).
r(xr(A),A).
g(A,B) :- g(B,A).
b(A,C) :- r(A,B), r(B,C).
y(B,C) :- b(A,B), b(A,C).
g(B,C) :- r(A,B), r(A,C).
r(A,C) :- r(A,B), g(B,C).
:- y(2,4).