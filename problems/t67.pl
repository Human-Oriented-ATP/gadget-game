g(1,A,3).
b(2,A,3).
y(xy(A),A).
r(X,Y) :- g(X,Y,Z), y(Y,Z).
r(X,Y) :- b(Y,X,Z), y(X,Z).
r(X,Z) :- r(X,Y), r(Y,Z).
:- r(1,2). 