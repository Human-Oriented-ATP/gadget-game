r(1, 2). % reachability (edge = r, path = b)
r(2, 3).
b(A, B) :- r(A, B).
b(A, C) :- b(A, B), r(B, C).
:- b(1, 3).
