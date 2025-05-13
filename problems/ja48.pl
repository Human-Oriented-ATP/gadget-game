r(1,2).
r(2,3).

b(4,1).
b(5,2).
b(6,3).

g(7,4,5).
g(8,5,6).
y(9,7,8).

r(A,B) :- r(A,C), r(C,B).
r(A,B) :- b(A,C), b(B,D), r(C,D).
r(C,D) :- b(A,C), b(B,D), r(A,B).

y(xy(A,B),A,B).
g(xg(A,B),A,B) :- r(A,B).
g(C,A,B) :- r(A,D), r(D,B), g(E,A,D), g(F,D,B), y(C,E,F).

:- g(9,4,6).