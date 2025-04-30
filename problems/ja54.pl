
r(3,8,9).
w(1,8,2,9).
r(xr(A,B),A,B).
g(xga(A,B),A,B).
y(8,9).

r(A,10,A).
r(A,B,C) :- r(A,C,B).
r(A,B,C) :- r(A,D,E), r(D,B,F), r(C,F,E).

g(xg(A,B),xgg(A,B),A,B).

g(10,A,B) :- r(A,C,D), r(B,E,F), y(D,F), g(C,E,D,F).
y(A,B) :- y(B,A).
y(A,B) :- y(A,C), y(A,D), r(B,C,D). 


g(A,B,C) :- r(B,D,E), r(C,D,F), g(G,E,F), r(A,D,G).
r(A,D,G) :- r(B,D,E), r(C,D,F), g(G,E,F), g(A,B,C).


w(A,B,C,D) :- r(H,A,D), r(H,B,C).
r(H,A,D) :- w(A,B,C,D), r(H,B,C).

b(A,B,C,D) :- w(A,B,X,10), w(C,D,X,10).
:- b(1,8,2,9).