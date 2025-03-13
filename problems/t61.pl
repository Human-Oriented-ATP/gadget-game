b(3,1,2).
b(6,4,5).
g(7,3,6).
g(xg(A,B),A,B).
g(C,A,B) :- g(A,D,F), g(B,E,F), g(G,D,E), b(C,G,F).
b(C,G,F) :- g(A,D,F), g(B,E,F), g(G,D,E), g(C,A,B).
o(xo(A,B),A,B).
o(A,B,C) :- o(A,C,B).
b(C,A,B) :- o(A,D,F), o(B,E,F), b(C,D,E).
b(C,D,E) :- o(A,D,F), o(B,E,F), b(C,A,B). 
r(A) :- b(A,C,D).
:- r(7).

