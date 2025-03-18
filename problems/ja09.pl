r(3,4).
r(3,5).
r(4,5).
b(1).
b(2).
g(6,3,4,5).
g(7,2,6,1).

g(E,C,B,D) :- g(A,B,C,D), r(B,C), g(E,2,A,1).
g(E,B,D,C) :- g(A,B,C,D), r(C,D), g(E,2,A,1).
g(B,A,C,D) :- g(A,B,C,D), b(C), b(D).
b(A,B) :- b(A).
b(A,B) :- b(B).
g(A,C,B,D) :- g(A,B,C,D), b(B,C).
g(A,B,D,C) :- g(A,B,C,D), b(C,D).

:- g(7,5,4,3).
