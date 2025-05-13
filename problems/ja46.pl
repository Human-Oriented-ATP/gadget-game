g(1).
b(3,1).

g(A,A,B) :- y(A,B).
b(A,B) :- b(B,A).
y(A,B) :- b(A,C), b(B,D), y(D,C).
g(A,B,C) :- g(A,C,B).
r(A,B,C) :- r(A,C,B).
b(xb(A),A).
g(xg(A,B),A,B).
r(xr(A,B),A,B).
r(A,D,E) :- g(B), b(C,B), g(D,A,B), g(E,A,C).

g(A) :- r(2,B,C), b(D,A), g(B,2,A), g(C,2,D).
:- g(3).