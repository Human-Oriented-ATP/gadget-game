
w(3).
b(xb(A),A).
b(A,yb(A)).
o(xo(A),A).
o(A,yo(A)).
p(xp(A),A).
p(A,yp(A)).
r(A,C) :- g(A,B), w(B), g(B,C).
g(A,C) :- b(A,B), b(B,C).
b(A,C) :- o(A,B), o(B,C).
o(A,C) :- b(A,B), b(B,C).
o(A,C) :- p(A,B), p(B,C).
p(A,C) :- o(A,B), o(B,C).
bl(D,A,C) :- p(A,B), p(B,C).
p(A,B) :- bl(1,B,C).
p(A,B) :- bl(1,C,A).
:- r(1,2).

