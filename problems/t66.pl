b(xb(A,B),A,B).
g(xg(A,B),A,B).
g(B,A,C) :- b(A,B,C).
r(V,W) :- b(U,Y,Z), g(V,U,Z), r(U,W).
:- r(1,2).