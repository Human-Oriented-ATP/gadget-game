r(1).
r(2).
b(A,B,C,A,D,E).
b(A,B,C,D,B,E).
b(A,B,C,D,E,C).
g(E) :- r(A), r(B), r(C), r(D), b(E,E,E,A,B,C), b(1,1,1,A,B,C), b(E,E,1,B,C,D), b(1,1,E,A,B,D), b(E,1,E,A,B,C), b(E,1,1,B,C,D).
:- g(2).