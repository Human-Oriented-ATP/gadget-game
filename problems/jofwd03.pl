r(1). 
b(2). 

g(A, B) :- r(A), b(B).
g(A, B) :- b(A), r(B).
g(A, A) :- g(A, B), g(B, A).
g(A, B) :- g(B, A).

:- g(1, 1).