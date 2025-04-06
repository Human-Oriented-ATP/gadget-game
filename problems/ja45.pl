r(A,1,A).
y(1,A).

g(A,A,B) :- y(A,B).
b(A,B) :- b(B,A).
y(A,B) :- b(A,C), b(B,D), y(D,C).
g(A,B,C) :- g(A,C,B).
r(A,B,C) :- r(A,C,B).
b(xb(A),A).
g(xg(A,B),A,B).
r(xr(A,B),A,B).

g(A) :- r(2,B,C), b(D,A), g(B,2,A), g(C,2,D).
:- g(1).