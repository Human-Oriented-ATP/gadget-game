g(1,8,9).
g(2,7,8).
g(3,7,9).
g(xg(A,B),A,B).
g(A,B,C) :- g(A,D,E), g(B,D,F), g(C,E,F).
g(A,B,C) :- g(A,E,F), g(B,D,F), g(C,D,E).
:- g(1,2,3).