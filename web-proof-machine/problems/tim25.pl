r(4,3).
g(5,2,4).
b(6,1,5).
b(7,1,2).
b(8,1,4).
g(9,2,3).
b(10,1,9).
b(11,1,3).
g(10,7,11).
r(E,A) :- g(A,B,C), r(D,C), g(E,B,D).
g(E,B,D) :- r(E,A), g(A,B,C), r(D,C).
b(E,A,F) :- b(D,A,C), g(E,D,A), r(F,C).
g(E,D,A) :- b(D,A,C), b(E,A,F), r(F,C).
g(E,A,F) :- g(D,A,B), g(E,D,C), g(F,B,C).
g(E,D,C) :- g(D,A,B), g(E,A,F), g(F,B,C).
:- g(6,7,8).



