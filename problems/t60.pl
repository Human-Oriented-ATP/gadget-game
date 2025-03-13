g(3,1,2).
r(4,1).
r(5,2).
r(6,3).
g(7,4,5).
b(A,B) :- r(B,A).
y(xy(A),A).
g(xg(A,B),A,B).
r(C,B) :- r(C,A), y(B,A).
y(A,B) :- y(B,A). 
b(C,B) :- b(A,B), b(D,B), y(D,A), r(C,A).
b(C,F) :- g(C,A,B), g(F,D,E), b(A,D), b(B,E). 
y(C,F) :- g(C,A,B), g(F,D,E), y(A,D), y(B,E).
:- b(6,7).


