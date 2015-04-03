-Write an exportBoard function, that is able to accept and append a specific robot as a target.
	-This is an optional function, off the vanilla export board function that returns:
		-A board state: Locations of all of the robots.
		-The color of the active robot.


We are writing a function that:
Takes:
	-An input array, with a completeBoard, and a string representing the color of the robot.

Outputs:
	-Finds the optimal solution, returning an array of moves:
		[5, "RW", "RE", "RS", "GN", "RE"];

Can we do this better than with iterative depth first. 
Wouldn't it make more sense to use a real, graph-traveral algorithm. Working backwards?



