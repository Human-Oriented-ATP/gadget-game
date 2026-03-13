b(1,2).
b(1,3).
b(2,1).
b(3,2).

r(xr(A,B),A,B) :- b(A,B).
g(xg(A,B),A,B) :- b(A,B).

y(A,C) :- r(R,A,B), r(R,A,C).
w(R,G,X,Y) :- r(R,X,Y), g(G,X,Y), b(Y,X), b(1,X).
o(A,B) :- r(R,A,B), g(G,A,B), w(R,G,A,B).

c(X,Z) :- y(X,Y), o(Y,Z).
:- c(1,1).
