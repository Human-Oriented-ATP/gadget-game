w(1).
y(2).
g(3,1).
o(3,1).
g(4,2).
bl(5).
striped_bl(5).
p(5,3,4).
striped_p(5,1,2). 
b(A,C) :- b(C,A).
c(A,B) :- g(A,B), g(C,B), b(A,C), o(C,B).
o(A,B) :- g(A,B), g(C,B), b(A,C), c(C,B).
w(A) :- g(A,B), c(A,B), w(B). 
w(B) :- p(F,A,B), w(A), bl(F). 
g(C,D) :- g(A,B), p(F,A,C), striped_p(F,B,D).
b(C,D) :- b(A,B), p(F,A,C), p(F,B,D), striped_bl(F).
c(C,D) :- g(C,D), w(C), y(D).
:- o(4,2).
