# Code Style for IUMTWEB Assignement

## Guidelines
### Indentation
2 spaces, configure the IDE/TextEditor to use spaces (soft tabs) instead of Tabs
(hard tabs).
One line of code should not exceed 80 characters, configure IDE/TextEditor 
to wrap the lines in 80 chars
if a function signature exceed 80 chars indent like this:
```java
@GetMapping("/get_movies_by_name")
public ResponseEntity<Page<Movie>> getMovieByName(
  @RequestParam(value = "name", defaultValue = "") String movie_name,
  @RequestParam(value = "page_num", defaultValue = "0") int page_num,
  @RequestParam(value = "page_sz", defaultValue = "25") int page_sz) {
  // do stuff
}
```

### Curly brackets
Always warp code in curly brackets '{' 
even when they wrap a single line of code, to avoid misreading

### if while statements
Please always compare the variable to the expected value to avoid misreading and
logic errors (possible in C)

example:
```java
if(value) { /* do something */ } //WRONG
if(value == true) { /* do something */ } //OK
while(true) { /* do something */ } //ACCEPTABLE
```

### Statements
wrap in spaces any variable check or assignment for readability

```java
int val = 50; //OK
if(val == 50){
  System.out.println(val);    
}

int val=50; //WRONG
if(val==50){
  System.out.println(val);
}
```

### Function order
write the functions top down from micro to macro, and the main function at 
the end for better readability
example
```java
class Main {
  public static int foo(){
    return 1;
  }

  public static void bar(){
    System.out.println(foo());
  }

  public static void main(String[] args){
    bar();
  }
}
```

### error checking with if instead of try/catch
when checking for a null value prefer doing it with an if instead of a try/catch
because the try/catch statement is much more complex and slow at runtime.
if you are forced to use a try/catch use it

```java
if(val != null) { /* do something */ } //OK
        
try { //WRONG
  val.toString();
} catch (NullPointerException e) {
  // dealing with exception    
}
```

### Code Modularization
Modularize the code as much as possible for better code navigation

```javascript
index.js
app.get('/movies_info', get_movies_by_name)

functions.js
function get_movies_by_name(request, response) {
  //stuff to do...
}
```

## Variables, Classes and Functions
### variable names
a variable name should not exceed 15 characters and must be in snake_case
if a variable is global add a '_' at the start (e.g.)```int _my_global_var```

### Classes
for Class names use CamelCase format
for Class members use CamelCase format (do not exceed 15 characters)
for functions use ...

### HTML
write ids and classes with snake_case format