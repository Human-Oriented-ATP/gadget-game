r(2,1).
r(3,2).
g(1,4).
b(4).
g(A,C) :- g(A,B), g(B,C).
b(B) :- r(B,A). 
g(B,C) :- g(A,C), r(B,A), b(C).
r(B,1) :- b(B), g(B,4).
:- b(3,1).