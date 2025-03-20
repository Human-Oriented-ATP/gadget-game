g(xg(A),A).
b(xb(A),A).
o(xo(A),A).
p(xp(A),A).
r(A,B) :- g(C,A), g(B,D).
g(A,B) :- b(C,A).
g(A,B) :- b(B,C).
b(A,B) :- o(C,A).
b(A,B) :- o(B,C).
o(A,B) :- p(C,A,D).
o(A,B) :- p(B,C,D).
p(A,B,C) :- w(A,C).
w(A,B) :- w(B,A).
:- r(1,2).