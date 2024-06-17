<div align="center">

<h1 align="center">This is Kaeon FUSION</h1>
<h2 align="center">A Language Without Limits!</h2>

<p align="center">
	<img src="https://raw.githubusercontent.com/Atlas-of-Kaeon/Atlas-of-Kaeon.github.io/master/Kaeon%20United/3%20-%20Wonders/2%20-%20Source/2%20-%20Assets/1%20-%20Visual/1%20-%20Images/1%20-%20Iconography/1%20-%20ONE/2%20-%20Kaeon%20FUSION/Kaeon%20FUSION%20Logo.png" height="300px"/>
</p>

</div>

    Use: Kaeon United
    
    Log Line: "This is Kaeon FUSION!"

<h2 align="center">What is Kaeon FUSION?</h2>

Kaeon FUSION (pronounced "KAI-on") is, in one layman-friendly sentence, a "build your own language"
language.

### Basic Principles

Kaeon FUSION, in a similar manner to LISP, operates on a code-as-data paradigm. It shares its
syntax with a data interchange language called [ONE](https://github.com/Atlas-of-Kaeon/Atlas-of-Kaeon.github.io/blob/master/Kaeon%20United/3%20-%20Wonders/1%20-%20Documentation/1%20-%20Guides/2%20-%20ONE/1%20-%20ONE/README.md), which encodes data as a tree of strings. In
ONE, each node on said tree is referred to as an element. The string inside an element is referred
to as its content.

While ONE alone serves only to encode data, a convention referred to as the [FUSION](https://github.com/Atlas-of-Kaeon/Atlas-of-Kaeon.github.io/blob/master/Kaeon%20United/3%20-%20Wonders/1%20-%20Documentation/1%20-%20Guides/2%20-%20ONE/4%20-%20FUSION/README.md) system
allows an interpreter to operate on said data as code by establishing a recursive flow sequence
where each element is interpreted as a command that executes and returns a value to its parent.

Kaeon FUSION builds on the FUSION system by integrating a single command called "Use". Use receives
the content of its children and interprets them as file paths leading to modules called interfaces.

Interfaces contain code which, when referenced, is integrated into the code of the interpreter at
runtime. This allows the properties of the language to be dynamically edited in any way, from
adding new commands to altering the order in which the interpreter navigates the code. This can
even be as drastic as having the language transition from being object oriented to being purely
functional midway through the execution of a program.

But, it is not only the functionality of the language which is customizable. The syntax is also
fully configurable through a system called the [Universal Preprocessor](https://github.com/Atlas-of-Kaeon/Atlas-of-Kaeon.github.io/blob/master/Kaeon%20United/3%20-%20Wonders/1%20-%20Documentation/1%20-%20Guides/2%20-%20ONE/3%20-%20Universal%20Preprocessor/README.md).

The functionality needed for most use cases is integrated into the Standard interface. The standard
interface is included in [Kaeon United](https://github.com/Atlas-of-Kaeon/Atlas-of-Kaeon.github.io/blob/master/Kaeon%20United/3%20-%20Wonders/1%20-%20Documentation/README.md), as is a CLI for Kaeon FUSION.

ONE, ONE+, and the Universal Preprocessor may all be used independently of Kaeon FUSION.

### About ONE+

ONE is designed to be as minimalistic as possible, so to aid in writing it more efficiently by
hand, a superset of its syntax was developed called [ONE+](https://github.com/Atlas-of-Kaeon/Atlas-of-Kaeon.github.io/blob/master/Kaeon%20United/3%20-%20Wonders/1%20-%20Documentation/1%20-%20Guides/2%20-%20ONE/2%20-%20ONE%2B/README.md).

ONE and ONE+, in addition to being used as data interchange languages, function well as plain text
formats for human-readable written documents. As such, the specification documents for Kaeon FUSION
and its constituent technologies are written in them.

### About The Universal Preprocessor

The Universal Preprocessor is fundamentally similar to PHP. However, while PHP just allows the PHP
language to output to HTML, the Universal Preprocessor allows any language to output to any
language.

A universal preprocessor tag consists of a statement of the language being used, followed by code
written in said language. When said code executes, it takes the surrounding source code and the
position of its tag within said code as arguments. When executed, it may either log code to the
console, which shall be inserted at its location in place of itself, or may return code, replacing
the surrounding code entirely.

The Universal Preprocessor may also return a binary array instead of a string, allowing it to
function as a compiler in addition to a preprocessor.

The Universal Preprocessor may be used to alter the syntax of Kaeon FUSION in any way so long as
the resulting code is valid ONE or ONE+.

### Advantages

The primary advantage of Kaeon FUSION and its constituent technologies is that they can dynamically
adapt to changing developer needs without having to be rewritten from scratch, thus allowing them,
and applications developed with them, to remain viable indefinitely, long after other technologies
have died off due to their inflexibility in the face of obsolescence.

<h2 align="center">Kaeon FUSION Examples</h2>

[All Sample Code](https://github.com/Atlas-of-Kaeon/Atlas-of-Kaeon.github.io/tree/master/Kaeon%20United/3%20-%20Wonders/1%20-%20Documentation/2%20-%20Samples/1%20-%20Kaeon%20FUSION)

Here's a typical Kaeon FUSION hello world program:

    Use: Kaeon United

	Log Line: "Hello, world!"

Here's the solution to [Euler problem #1](https://projecteuler.net/problem=1),
using the Super Mode syntax through the universal preprocessor to convert the code,
which looks similar to Python,
to ONE:

	(] KF [> Use: SUPER <)

	sum = 0

	for range { i, 3, 999 }
	
		if { i % 3 == 0 or i % 5 == 0 }
			sum += i

	print sum

_NOTE: Super Mode has only been implemented in the Java based version of Kaeon FUSION, which is now depricated._

Here's the same code as above,
using the universal preprocessor to convert the code,
which now looks like LISP,
into ONE:

	(] KF [> Use: ONELisp <)

    (use "Kaeon United")

    (sum 0)
    (i 3)
	
	(scope
	
    	(scope
		
    		(break (not (or
    			(equal 0 (modulus i 3))
    			(equal 0 (modulus i 5)))))
		
    		(sum (add sum i)))

    	(i (add i 1))
    	(loop (less i 1000)))

    ("log line" sum)

Here again is the same code from the first example,
also written in ONE+,
without the universal preprocessor:

    Use: Kaeon United

    sum: 0

    i { 3 } Scope
	
    	Scope
		
    		Break: Not: Or
    			Equal: 0, Modulus: i, 3
    			Equal: 0, Modulus: i, 5
		
    		sum: Add: sum, i

    	i: Add: i, 1
    	Loop: Less: i, 1000

    Log Line: sum

Here's hello world,
written using [ONE](https://github.com/Atlas-of-Kaeon/Atlas-of-Kaeon.github.io/blob/master/Kaeon%20United/3%20-%20Wonders/1%20-%20Documentation/1%20-%20Guides/2%20-%20ONE/1%20-%20ONE/README.md),
the most basic form of Kaeon FUSION's syntax:

    -
    	Use
    -
    	-
    		Kaeon United
    	-
    -
    	Log Line
    -
    	-
    		Hello, world!
    	-