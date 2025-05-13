r(1,2).
r(2,3).

g(1,4,5).
g(2,4,6).
g(3,4,7).


g(7,5,6).
g(8,5,6).
y(9,7,8).

r(A,B) :- r(A,C), r(C,B).
r(A,B) :- b(A,C), b(B,D), r(C,D).
r(C,D) :- b(A,C), b(B,D), r(A,B).


g(xg(A,B),A,B) :- r(A,B).

w(X,Y,Z) :- g(A,X,Y), g(B,Y,Z), y(

:- w(4,5,6).