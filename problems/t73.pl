g(1,2).
g(2,3).
b(xb(A),A).
b(A,B) :- b(B,A).
r(B,A) :- g(C,D), b(A,C), b(B,D).
r(A,C) :- r(A,B), r(B,C).
g(B,A) :- r(C,D), b(A,C), b(B,D).
:- g(1,3).