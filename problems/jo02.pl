r(1).
o(2).
c(A, B) :- r(A), o(B).
g(A, B) :- c(A, B), o(B).
y(A, B) :- r(A), g(A, B).
w(A, B) :- b(A, A), b(B, A), b(A, B).
b(1, A) :- c(2, A).
b(A, 2) :- g(A, 1).
b(A, B) :- y(A, 2).
:- w(A, B).