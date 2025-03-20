g(1,2).
g(2,3).
b(xb(A),A).
b(A,B) :- b(B,A).
r(B,A) :- g(C,D), b(A,C), b(B,D).
b(A,C) :- b(A,B), b(B,C).
g(B,A) :- r(C,D), b(A,C), b(B,D).
:- g(1,3).