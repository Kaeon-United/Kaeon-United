<div align="center">

<h1 align="center">United C</h1>

<h2 align="center">A Modernized C/C++ Hybrid Language</h2>

<p align="center">
	<img src="https://raw.githubusercontent.com/Atlas-of-Kaeon/Atlas-of-Kaeon.github.io/master/Kaeon%20United/3%20-%20Wonders/2%20-%20Source/2%20-%20Assets/1%20-%20Visual/1%20-%20Images/1%20-%20Iconography/2%20-%20Kaeon%20United/1%20-%20United%20C/United%20C%20Logo.png" height="300px"/>
</p>

</div>

United C is a language designed to combine C and C++ into a single language,
and to update their syntaxes and build pipelines to match the conveniences of more modern languages such as Python and JavaScript.

However,
it seeks to do this without any compromise to their power,
their low level nature,
or their existing utilities.
As such,
it is 100% backwards compatible with C++ and almost entirely backwards compatible with C.

<h2 align="center">Basic Details</h2>

The utilities necessary for United C development are provided through the [Kaeon United](https://github.com/Atlas-of-Kaeon/Atlas-of-Kaeon.github.io/blob/master/Kaeon%20United/3%20-%20Wonders/1%20-%20Documentation/README.md) API.

United C files should have the file extension ".uc".

<h2 align="center">Example</h2>

The following is a hello world example in United C:

    use stdio.h

    printf("Hello, world!")

which,
if written in a file called "hello.uc",
may be compiled using the following command:

    npx kaeon-united ucc read hello.uc

_Note: You must have gcc, make, and Node.js installed for this command to work._

<h2 align="center">The Common C Convention</h2>

The ability for C and C++ to operate together is tied to the Common C convention,
which works as follows:

* All C and C++ code shall adhere to the latest version of the respective language.

* C code shall not use any features of the C language that C++ does not possess.

* The compiler shall determine which language to compile to by whether or not the code uses any
language features exclusive to C++.

<h2 align="center">United C Features</h2>

<h3>Code Outside the Main Function</h3>

Any operations placed outside a function will be placed into the main function
upon the compilation of an executable. If a main function is not already
declared, one will be inferred.

The main function, if automatically generated, shall be formatted to have a
return type of int, shall return zero, and shall have a parameter argc of type
int and a parameter argv of type char pointer array.

If there is both a manually defined main function present as well as operation
code placed outside the main function, the code within the manually defined
main function shall execute before the code outside of it.

<h3>Irrelevant Declaration Order</h3>

Functions and global variables in United C may be declared in any order.

<h3>Optional Semicolons</h3>

United C code may omit semicolons where they are otherwise required.

<h3>Dynamic Type Detection</h3>

The token "var" may be used in lieu of the data type of a variable, in which
case the type of said variable shall be predicted based on the value assigned
to it.

<h3>The "use" Operator and Online Dependencies</h3>

In place of the #include preprocessor, a sequence beginning with the token
"use", referred to as a use directive, may be used in its place, where an
indefinite number of paths to resources follow the use token, separated by
commas.

A use directive may terminate with either a new line or a semicolon.

Paths to global resources may be written as they are, but paths to local
resources must be encased in double quotes.

If a path has no file extension, the system will check for any matching file
with the extension "uc", "c", "h", or "cpp". If the extension cannot be
verified, an extension of "uc" shall be inferred.

Include and use directives may reference dependencies stored online by their
URLs, in which case the references must be encased in double quotes, as
references to local resources would be.

<h3>Multiline Literals</h3>

United C allows multiline literals starting and ending with backticks.
					
Backticks may be escaped using a backslash.

<h3>Bools in C</h3>

C code conforming to United C may use the literals true and false, which the
preprocessor shall convert to 1 and 0 respectively, and may also use the data
types bool and boolean, which the preprocessor shall convert to int.

<h3>The "@" Address Operator</h3>

United C allows @ to be used as the address token in addition to &.

<h3>The Universal Preprocessor</h3>

The main file and all local dependency files shall be preprocessed using the
[Universal Preprocessor](https://github.com/Atlas-of-Kaeon/Atlas-of-Kaeon.github.io/blob/master/Kaeon%20United/3%20-%20Wonders/1%20-%20Documentation/1%20-%20Guides/2%20-%20ONE/3%20-%20Universal%20Preprocessor/README.md) upon compilation.

<h2 align="center">CSB</h2>

Character Separated Binary,
or CSB for short,
is a simple text format for encoding raw binary data.

In CSB,
bytes may be written in binary format and may be separated by any form of whitespace.
Said bytes may omit leading zeroes.

For example,
if a file called "data.csb" contained the following code:

    1000001
    1000010
    1000011

then running the following command:

	npx kaeon-united assemble open data.csb data.out

would produce a binary file called "data.out",
which if opened in a text editor would display:

    ABC

If,
after that,
this command were to be run:

    npx kaeon-united disassemble read data.out data2.csb

Then a file called "data2.csb" would be generated containing the same content as data.csb.