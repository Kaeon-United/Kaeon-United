<div align="center">

<h1>ONE</h1>

<p align="center">
	<img src="https://raw.githubusercontent.com/Atlas-of-Kaeon/Atlas-of-Kaeon.github.io/master/Kaeon%20United/3%20-%20Wonders/2%20-%20Source/2%20-%20Assets/1%20-%20Visual/1%20-%20Images/1%20-%20Iconography/1%20-%20ONE/ONE%20Logo.png" width="300px"/>
</p>

</div>

ONE is an extremely minimalistic markup language that allows the user to define a tree of string literals.

String literals may only be encoded in elements,
and elements may be nested within one another.

An element is started with a minus sign followed by a new line and a tab.
Every character from the first tab (exclusive) to the new line character (inclusive if and only if not the last line in the element) is encoded into the string.
Every new line character must be followed either with a tab which continues the element,
or by a minus sign which ends the element.
There must be at least one line between the starting and ending lines.

If an element is nested within another element,
every line of the element must be preceded by one tab for every level it is nested.

No whitespace is permitted between elements.

A ONE file is referred to as a "document".

The proper file extension for a ONE file is ".one".

## Example ONE documents

### Document with one element with no content

    -
    	
    -

### Document with one element with content

    -
    	Element
    -

### Document with one element that has multiple lines

    -
    	Line 1
    		Line 2
    			Line 3
    -

Note: The above element encodes the following string: "Line 1\n\tLine 2\n\t\tLine3".

### Document with two elements

    -
    	Element 1
    -
    -
    	Element 2
    -

### Document with multiple elements, some of which have children

    -
    	Element 1
    -
    	-
    		Child 1
    	-
    	-
    		Child 2
    	-
    -
    	Element 2
    -
    -
    	Element 3
    -
    	-
    		Child 1
    	-
    		-
    			Grand Child 1
    		-