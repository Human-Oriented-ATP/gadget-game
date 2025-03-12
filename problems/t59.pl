r(1,1).
r(2,4).
r(3,4).
r(A,xr(A)).
g(xg(A,B),A,B).
r(B,1) :- r(B,C), g(C,A,A). 
w(A,1) :- r(A,1).
w(B,C) :- g(1,B,C).
g(1,B,C) :- w(B,C).
g(1,A,B) :- g(C,A,B), w(C,1). 
g(C,A,B) :- r(F,C), r(D,A), r(E,B), g(F,D,E).
:- w(2,3).



