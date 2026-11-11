c(1, 2). % reachability (edge = c, path = r)
c(2, 3).
r(A, B) :- c(A, B).
r(A, C) :- r(A, B), c(B, C).
:- r(1, 3).
