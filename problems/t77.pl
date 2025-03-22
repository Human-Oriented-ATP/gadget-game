
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
bl(A,C) :- p(A,B), p(B,C).
p(1,B) :- bl(B,C).
p(A,2) :- bl(C,A).
:- r(1,2).

