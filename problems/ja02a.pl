r(4,2,3).
r(7,6,5).
g(2,5).
g(3,6).
r(xr(A,B),A,B).
g(xg(A),A).
b(A,A).
b(A,B) :- b(B,A).
r(A,B,1) :- b(A,B).
r(A,1,B) :- b(A,B).
g(A,B) :- g(B,A).
r(1,A,B) :- g(A,B).
g(A,B) :- r(1,A,B).
r(A,B,C) :- r(D,B,C), b(A,D).
r(A,B,C) :- r(A,D,C), b(B,D).
r(A,B,C) :- r(A,B,D), b(C,D).
b(Y,W) :- r(X,A,B), r(Y,X,C), r(Z,B,C), r(W,A,Z).
:- g(4,7).