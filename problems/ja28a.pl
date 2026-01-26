y(9,1).

g(5,2,3).
g(6,2,4).
r(7,5,6).
r(8,3,4).
g(9,2,8).


w(xw(X,Y),X,Y).

g(C,A,B) :- g(C,B,A).
r(C,A,B) :- r(C,B,A).

y(A,X) :- w(X,Y,Z), y(A,Y).
y(X,A) :- w(A,B,X).
y(D,X) :- g(A,B,C), w(Y,X,B), w(Z,X,C), y(A,X), y(D,Y), y(D,Z).


y(C,X) :- y(A,X), y(B,X), r(C,A,B).
y(C,X) :- y(A,X), g(C,A,B).
y(A,X) :- y(C,X), r(C,A,B).


:- y(7,1).
