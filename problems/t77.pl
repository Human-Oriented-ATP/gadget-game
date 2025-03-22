
w(3).
b(xb(A),A).
striped_b(A,xb(A)).
o(xo(A),A).
striped_o(A,xo(A)).
p(xp(A),A).
striped_p(A,xp(A)).
b(A,B) :- striped_b(A,B).
o(A,B) :- striped_o(A,B).
p(A,B) :- striped_p(A,B).
r(A,C) :- g(A,B), w(B), g(B,C).
g(A,C) :- b(A,B), b(B,C).
b(A,C) :- o(A,B), o(B,C).
o(A,C) :- b(A,B), b(B,C).
o(A,C) :- p(A,B), p(B,C).
p(A,C) :- o(A,B), o(B,C).
bl(A,C) :- p(A,B), p(B,C).
p(A,B) :- c(A,C,B,D).
p(A,B) :- c(C,B,D,A).
c(A,B,C,D) :- bl(C,D).
:- r(1,2).

