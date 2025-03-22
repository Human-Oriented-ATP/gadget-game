r(A,C) :- g(A,B), g(B,C).
g(A,B) :- b(A,B), b(B,C).
b(1,C) :- o(C,D).
o(A,C) :- b(A,B), b(B,C).
b(A,C) :- g(A,B), g(B,C).
g(xg(A),A).
g(A,yg(A)).
b(xb(A),A).
b(A,yb(A)).
:- r(1,2).