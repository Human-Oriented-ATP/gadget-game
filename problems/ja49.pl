
b(6,1).
b(xb(A),A).

g(2,1).
y(2,3).
w(A,A).

y(A,B,xy(A,B)) :- g(A,B).
y(A,C) :- y(A,B,C).

g(A,6,C,4) :- g(A,6,C,5), y(2,D), b(C,D).

r(B,A) :- g(C,B), y(C,A).

w(A,B) :- y(C,D,E), g(F,D,E,A), g(G,D,E,B), w(F,G).


r(A,B) :- r(A,C), r(C,B).
r(A,B) :- b(A,C), b(B,D), r(C,D).
g(A,B) :- b(A,C), b(B,D), g(C,D).
y(A,B) :- b(A,C), b(B,D), y(C,D).
b(B,D) :- b(A,C), y(A,B), y(C,D).


g(xg(A,B,C),A,B,C) :- r(A,B).

:- w(4,5).