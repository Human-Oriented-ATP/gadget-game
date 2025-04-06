g(1).
g(2).
g(3,1,2).

g(A,A,B) :- y(A,B).
b(A,B) :- b(B,A).
y(A,B) :- b(A,C), b(B,D), y(D,C).
y(A,B) :- g(A,B,C).
g(A,B,C) :- g(A,C,B).
r(A,B,C) :- r(A,C,B).
g(C,A,B) :- g(C,A,D), b(D,E), b(B,F), g(E,A,F).
g(A,D,E) :- g(A,B,C), g(B,D,F), g(E,F,C).
r(A,D,E) :- r(A,B,C), r(B,D,F), r(E,F,C).

b(xb(A),A).
g(xg(A,B),A,B).
r(xr(A,B),A,B).
r(A,D,E) :- g(B), b(C,B), g(D,A,B), g(E,A,C).

g(A) :- r(4,B,C), b(D,A), g(B,4,A), g(C,4,D).
:- g(3).