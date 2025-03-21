g(1,2,4).
g(1,3,5).
g(2,3,6).
g(xg(A,B),A,B).
g(A,B,C) :- r(A,B,D), r(A,C,E), r(B,C,F).
r(A,B,G) :- g(C,D,A), g(F,E,B), g(D,E,G).
:- g(4,5,6).