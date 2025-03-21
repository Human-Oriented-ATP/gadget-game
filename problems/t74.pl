g(4,1,2).
g(5,1,3).
g(6,2,3).
b(xb(A),A).
b(A,B) :- b(B,A).
r(A,B,C) :- g(D,E,F), b(A,D), b(B,E), b(C,F).
g(A,B,C) :- r(D,E,F), b(A,D), b(B,E), b(C,F).
r(D,E,F) :- r(D,A,B), r(E,A,C), r(F,B,C).
:- g(4,5,6).