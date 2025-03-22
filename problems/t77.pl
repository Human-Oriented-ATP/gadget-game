
w(3).
b(xb(A),A).
striped_b(xb(A),A).
o(xo(A),A).
striped_o(xo(A),A).
p(xp(A),A).
striped_p(xp(A),A).
b(A,B) :- striped_b(B,A).
o(A,B) :- striped_o(B,A).
p(A,B) :- striped_p(B,A).
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

