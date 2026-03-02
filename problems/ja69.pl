g(6,1,2,3).
g(7,4,1,5).
b(2,1,5).
b(3,1,4).
r(1,4).


g(A,B,C,D) :- g(A,C,B,D).
g(A,B,C,D) :- g(A,C,D,B).
b(A,B,C) :- b(A,C,B).

r(A,A).
r(A,B) :- b(A,B,C).
r(A,B) :- r(A,C), r(C,B).
r(A,B) :- g(A,C,D,E), g(B,F,G,H), r(C,F), r(D,G), r(E,H).


:- r(6,7).
