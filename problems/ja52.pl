y(6,8,4).
y(7,9,5).
w(1,6,2,7,8).
w(1,6,2,7,9).
w(A,B,C,D,E,xw(A,B,C,D,E)) :- w(A,B,C,D,E).
r(xr(A,B),A,B).
y(xy(A,B),A,B).
g(xga(A,B),A,B).

r(A,B,C) :- r(A,C,B).
r(A,B,C) :- r(A,D,E), r(D,B,F), r(C,F,E).

r(F,G,H) :- w(A,B,C,D,E,X), r(F,G,I), r(H,A,D), r(I,B,C), y(G,E,X).
w(A,B,C,D,E,X) :- r(F,G,H), r(F,G,I), r(H,A,D), r(I,B,C), y(G,E,X).
g(xg(A,B),xgg(A,B),A,B).

r(A,J,K) :- g(A,B,C), r(B,D,E), r(C,F,G), y(E,8,H), y(G,9,I), y(J,10,H), y(K,10,I), g(D,F,H,I).

g(A,B,C) :- r(B,D,E), r(C,D,F), g(G,E,F), r(A,D,G).
r(A,D,G) :- r(B,D,E), r(C,D,F), g(G,E,F), g(A,B,C).

y(A,B,C) :- r(A,D,E), y(D,B,F), y(E,B,G), g(C,F,G).


w(A,B,C,D,E) :- w(A,B,C,D,E,F).
:- w(1,6,2,7,10).