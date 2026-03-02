g(6,1,2,3).
g(7,1,2,4).
g(8,3,4,5).
r(3,1).
r(1,5).
r(5,2).
r(2,4).
b(6,7).
b(7,8).
b(6,8).
b(A,B) :- b(B,A).

g(A,B,C,D) :- g(A,C,B,D).
g(A,B,C,D) :- g(A,C,D,B).

r(A,A).
r(A,B) :- r(A,C), r(C,B).
r(A,B) :- g(A,C,D,E), g(B,F,G,H), r(C,F), r(D,G), r(E,H).

w(A,B,C) :- r(A,B), r(B,C), b(A,B), b(B,C).


:- w(A,B,C).
