g(1,2,3).
g(1,2,7).
g(5,2,4).
g(5,6,4).
g(6,3,4).
g(6,7,4).
r(1,5).
r(2,6).
r(3,7).
g(A,B,C) :- g(C,A,B).
r(A,B) :- r(B,A).
b(A,B) :- b(B,A).
b(A,B) :- g(A,B,C), g(A,B,D), r(C,D).
b(B,C) :- b(A,B), b(D,C), r(A,D).
w(B) :- b(A,B), b(C,B), r(A,C).
:- w(4).



