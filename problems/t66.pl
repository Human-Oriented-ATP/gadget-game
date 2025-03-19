b(xb(A,B),A,B).
g(xg(A,B),A,B).
g(B,A,C) :- b(A,B,C).
r(V,W) :- r(V,Y,W), g(Y,X,W).
:- r(1,2).