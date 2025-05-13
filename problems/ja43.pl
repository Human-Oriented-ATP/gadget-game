r(2,1,2,1,2,1,3).
b(2,2,2,3,4).
b(1,1,1,4,5).
b(2,1,2,5,6).
b(1,2,1,6,7).

r(A,B,C,D,E,F,3) :- r(B,A,C,D,E,F,3).
r(A,B,C,D,E,F,3) :- r(A,B,D,C,E,F,3).
r(A,B,C,D,E,F,3) :- r(A,B,C,D,F,E,3).

r(A,B,C,D,E,F,G) :- r(A,B,C,D,E,F,H), b(A,I,J,H,G).
r(A,B,C,D,E,F,G) :- r(A,B,C,D,E,F,H), b(I,C,J,H,G).
r(A,B,C,D,E,F,G) :- r(A,B,C,D,E,F,H), b(I,J,E,H,G).

g(A) :- r(B,C,D,E,F,G,A).
:- g(7).