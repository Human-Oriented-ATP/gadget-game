b(1).
r(A) :- bl(A).
r(A) :- g(A).
r(A) :- y(A).
r(A) :- o(A).

g(A) :- y(A).
g(A) :- bl(A).
bl(A) :- y(A).
bl(A) :- g(A).

o(A) :- b(A).

:- r(1).