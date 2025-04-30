
b(2,1).
b(3,1).

r(2,3,A).

r(A,B,C,xr(A,B,C)) :- r(A,B,C).

y(E,D) :- r(A,B,C,D), b(B,E).
y(E,D) :- r(A,B,C,D), b(C,E).
y(D,C) :- r(A,B,C,D).
y(A,B) :- y(A,C), y(C,B).


g(A,B,C,D) :- g(A,E,F,D), r(B,E,G,D), b(B,C), y(C,D).
g(xg(A,B,C),A,B,C) :- b(A,B), y(B,C).
y(A,B,xy(A,B)).


w(A,B) :- y(A,B,C), g(D,A,E,F), g(D,B,E,F), y(F,C).


:- w(2,3).