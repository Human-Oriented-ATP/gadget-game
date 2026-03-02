r(1,2).
r(2,3).

g(4,1,2).
g(5,2,2).
g(6,2,3).
g(7,3,3).
g(8,1,6).
g(9,2,6).
g(10,2,7).
g(11,3,7).
y(3,A).



b(A,C) :- r(A,B), r(B,C).
r(A,C) :- r(A,B), r(B,C).
g(A,B,C) :- g(A,C,B).
r(A,B) :- g(A,C,D), g(B,E,D), r(C,E).

y(A,B) :- g(A,C,D), g(B,E,F), y(C,E), y(D,F). 
w(A,B) :- y(11,A), y(11,B), b(A,B).

:- w(A,B).
