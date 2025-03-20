g(xg(A),A).
g(A,xg(A)).
b(xb(A),A).
b(A,xb(A)).
o(xo(A),A).
o(A,xo(A)).
p(xp(A),A).
p(A,xp(A)).
r(A,B) :- g(C,A), g(B,D).
g(A,B) :- b(C,A).
g(A,B) :- b(B,C).
b(A,B) :- o(C,A).
b(A,B) :- o(B,C).
o(A,B) :- p(C,A,D).
o(A,B) :- p(B,C,D).
p(A,B,C) :- w(A,C).
:- r(1,2).