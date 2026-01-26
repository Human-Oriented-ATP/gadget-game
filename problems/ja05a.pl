r(2,1,1).

w(1,3).
g(4,3,3).
r(5,3,3).


r(xr(A,B),A,B).
g(xr(A,B),A,B).
w(xw(A),A).

r(A,B,C) :- r(A,C,B).
g(A,B,C) :- g(A,C,B).
g(A,1,A).

w(H,E) :- w(A,B), w(C,D), g(E,B,D), g(F,A,D), g(G,B,C), r(H,F,G).
g(A,B,C) :- r(A,E,E), g(E,B,D), r(C,D,D).


:- w(5,4).