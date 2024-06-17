<div align="center"><h1>Universal Preprocessor</h1></div>

The Universal Preprocessor is a preprocessing system that can be injected into the source code of any programming or markup language,
including but not limited to ONE and ONE+.

It is extremely versatile and may be used to customize the target source code to an almost indefinite degree.

## How it Works

The Universal Preprocessor allows for directives to be inserted into any text file.

Said directives may contain code written in any language (in theory; the current implementation only supports Kaeon FUSION and JavaScript).

When the preprocessor is executed,
the code within the directives will execute in the order that the directives are placed.

The code within the directive operates as a function that recieves two unnamed arguments,
the first being the current contents of the text file with all preprocessor directives removed,
and the second being the index of the directive within said cropped text.

Anything written to stdout (that is, anything that would normally be printed to the console),
will be injected where the directive is placed.
However,
if the code,
executing as a function, returns a string,
said string will overwrite the text file entirely.

The language used within a preprocessor directive may either be explicity declared or implicitly
detected.

Furthermore,
the code for a directive,
in addition to returning a string,
may also return a byte array,
which can allow the Universal Preprocessor to function as a compiler by saving said byte array as a compiled program.
In theory,
this can allow for languages based in ONE,
and by extension,
in Kaeon FUSION,
to be compiled.
However,
this functionality may not be available in all implementations of the Universal Preprocessor.

## Preprocessor Directive Structure

Explicit Language Declaration:

    (] Kaeon FUSION [> # Kaeon FUSION Code <)

Implicit Language Detection:

    (> # Kaeon FUSION Code, thus the language will be detected as Kaeon FUSION <)

Kaeon FUSION may be declared as either "Kaeon FUSION", or as "KF".

JavaScript may be declared as either "JavaScript", or as "JS".

## Examples

### Example 1

The following code:

    Hello
    (] JS [>

    	for(let i = 0; i < 10; i++)
    		console.log("ABC:", i, "\n");
    <)
    World

Will be preprocessed to:

    Hello
    ABC: 0
    ABC: 1
    ABC: 2
    ABC: 3
    ABC: 4
    ABC: 5
    ABC: 6
    ABC: 7
    ABC: 8
    ABC: 9
    
    World

### Example 2

The following code:

    Hello
    (] JS [> console.log("INDEX:", arguments[1]); <)
    World

Will be preprocessed to:

    Hello
    INDEX: 6
    World

### Example 3

The following code:

    Hello
    (] JS [> return arguments[0].split("o").join("0"); <)
    World

Will be preprocessed to:

    Hell0
	
    W0rld