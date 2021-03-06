## Link to functionning prototype:

http://stamga.com/sonus/

## Artist statement:

Sonus Room was created as an abstract audiovisual digital room, where users around the world can experiment with alternative forms of collaboration. The minimal, almost invisible interface, pushes people to learn how to use the tool by themselves, therefore opening up the project to multiple outcomes. Not only are the visuals minimal, but the sounds are also designed in a way that they are not explicitly seen as, but can be used as, musical instruments, to encourage users to explore different possible uses.

The goal is to allow us to discover different types of user behaviors, as the project spreads and becomes used by multiple people at a time, and to see how the tool is used. Some expected outcomes are that the tool could be used to communicate back and forth with sounds, to play and compose music together, or perhaps to make as much noise as possible, but hopefully, the result goes beyond these expected outcomes. While the main focus is on the audio collaboration, it is possible that the visuals take on an unexpected level of importance, where users attempt to make their visualization interact with other people's visualization.

The reason behind the openness of Sonus Room is to break away from the tedious process of creating an account and tying yourself to an online persona. The anonymity and simplicity allows for rich, instant interactions, while also encouraging people to from around the world to act and react as if they were in the same actual room.

## Research questions:
* Can I avoid using a database to store the last key stroke?
* Will the long polling technique work or will short polling be more appropriate?
* Will MySQL be fast enough to store and retrieve from and to many users?
* Or will the server response be too slow and not be good enough for the collaboration?
* Will I be forced to rent another server and use Websocket?
* Will p5.sound or p5.gibber be more appropriate for generating sounds?

## Decisions and new questions:
* Tried JSON, couldn't write more than 1 user at a time.
* Tried long polling, server was capped at 1 second looping (sleep & usleep)
* Tried short polling, 100ms, became super responsive and MySQL was able to handle it.
* Will I need a separate library for a particle systems or will I be able to do it myself?
* Will my server crash, slow down or shut down if there are too many users at once? If so, how many users?
* How will having multiple instruments assigned randomly change the user experience?
