r(1,2).
b(3,1).
b(4,2).
o(5,1).
o(6,2).
g(xg(A,B),A,B).
r(A,C) :- r(A,B), r(B,C).
g(A,B,B) :- b(A,B).
g(C,A,B) :- o(C,A), b(B,A).
r(D,E) :- g(D,A,C), g(E,B,C), r(A,B).
r(D,E) :- g(D,C,A), g(E,C,B), r(A,B).
:- r(5,6).