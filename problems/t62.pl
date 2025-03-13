r(1,2).
r(3,4).
r(5,6).
g(1,3,5).
b(1,4).
b(3,6).
b(5,2).
r(A,B) :- b(B,A).
b(A,B) :- r(B,A). 
g(A,B,C) :- g(B,C,A).
g(A,B,C) :- g(B,A,D), r(D,B), b(A,C).
b(A,B) :- b(A,C), b(B,D), r(C,D).
r(A,B) :- r(A,C), r(B,D), b(C,D).
:- g(2,4,6).
