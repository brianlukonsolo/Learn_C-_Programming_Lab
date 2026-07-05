/* ============================================================
   C Academy - original interactive course content
   Roadmap follows The C Programming Language, 2nd Edition.
   ============================================================ */
(function () {
  "use strict";

  var MODULES = [
    {
      title: "Getting Started",
      lessons: [
        {
          id: "c-home",
          nav: "Welcome",
          home: true,
          blocks: [{ hero: true }, { roadmap: true }],
        },
        {
          id: "c-structure",
          eyebrow: "Module 1 · Basics",
          title: "The Shape of a C Program",
          lede: "C programs are small, explicit, and close to the machine. Start with the exact pieces every program needs.",
          blocks: [
            { p: "A C source file is compiled into machine code. The operating system starts your program by calling `main`, and your program talks to the outside world through library functions such as `printf`." },
            {
              run:
`#include <stdio.h>

int main(void) {
  printf("Hello, C!\\n");
  return 0;
}`,
              title: "hello.c",
            },
            { p: "`#include <stdio.h>` makes the standard input/output declarations visible. `int main(void)` says `main` takes no arguments and returns an integer status code. `printf` writes formatted text to standard output." },
            { h2: "Statements and blocks" },
            { ul: [
              "Most C statements end with a semicolon `;`.",
              "A block is a sequence of declarations and statements inside `{ }`.",
              "C is case-sensitive: `count`, `Count`, and `COUNT` are different identifiers.",
            ]},
            { tip: "Use `int main(void)` when a program takes no command-line arguments. In C, an empty parameter list in a declaration has a different historical meaning than `void`." },
            {
              quiz: {
                q: "Which header declares printf?",
                options: ["<stdio.h>", "<stdlib.h>", "<string.h>", "<ctype.h>"],
                answer: 0,
                explain: "`printf`, `scanf`, `getchar`, `putchar`, and file I/O live in `<stdio.h>`.",
              },
            },
          ],
        },
        {
          id: "c-stdio-intro",
          eyebrow: "Module 1 · I/O",
          title: "Character Input and Output",
          lede: "C's simplest I/O model is a stream of characters. That idea powers filters, text tools, and much of Unix.",
          blocks: [
            { p: "`getchar()` reads one character from standard input. `putchar(c)` writes one character to standard output. The return type is `int`, not `char`, so it can also represent `EOF`." },
            {
              run:
`#include <stdio.h>

int main(void) {
  int c;

  while ((c = getchar()) != EOF) {
    putchar(c);
  }
  return 0;
}`,
              title: "copy_stdin.c",
              stdin: "C reads streams.\\n",
            },
            { p: "`EOF` is a symbolic constant that marks end-of-file or an input error. Always store `getchar()` in an `int` so no valid character value is confused with `EOF`." },
            {
              run:
`#include <stdio.h>

int main(void) {
  int c;
  int lines = 0;

  while ((c = getchar()) != EOF) {
    if (c == '\\n') {
      lines = lines + 1;
    }
  }
  printf("lines: %d\\n", lines);
  return 0;
}`,
              title: "line_count.c",
              stdin: "one\\ntwo\\nthree\\n",
            },
            { warn: "A `char` may be signed or unsigned depending on the implementation. Use `int` for character input loops that compare against `EOF`." },
          ],
        },
      ],
    },

    {
      title: "Types & Expressions",
      lessons: [
        {
          id: "c-types",
          eyebrow: "Module 2 · Data",
          title: "Variables, Types, and Declarations",
          lede: "Every C object has a type. The type controls size, representation, and which operations make sense.",
          blocks: [
            { p: "A declaration introduces a name and its type. C's fundamental arithmetic types include `char`, `short`, `int`, `long`, `float`, and `double`, with optional `signed` and `unsigned` qualifiers for integer types." },
            {
              run:
`#include <stdio.h>

int main(void) {
  char grade = 'A';
  int count = 12;
  unsigned int flags = 3U;
  double price = 4.50;

  printf("grade=%c count=%d flags=%u price=%.2f\\n",
         grade, count, flags, price);
  printf("sizeof(int) = %lu bytes\\n", (unsigned long) sizeof(int));
  return 0;
}`,
              title: "types.c",
            },
            { p: "`sizeof` yields the size of a type or object in bytes. The exact size of `int` and `long` is implementation-defined, so portable code checks limits or uses fixed-width types from `<stdint.h>` when exact widths matter." },
            { h2: "Declarations belong near the data" },
            { p: "Modern C permits declarations mixed with statements, but this course keeps examples conservative: declarations appear near the start of each block so they compile cleanly as old-style ANSI C too." },
            {
              quiz: {
                q: "What does sizeof(int) measure?",
                options: ["The current value of an int", "The number of bytes used by int", "The number of decimal digits in int", "The address of an int"],
                answer: 1,
                explain: "`sizeof` reports storage size in bytes. The result can vary between platforms.",
              },
            },
          ],
        },
        {
          id: "c-constants-operators",
          eyebrow: "Module 2 · Expressions",
          title: "Constants, Operators, and Conversions",
          lede: "C expressions combine values with compact operators. The rules are powerful, but you must know where conversions happen.",
          blocks: [
            { p: "Constants can be written directly as literals (`17`, `3.14`, `'x'`, `\"text\"`) or named with `#define`, `const`, or an `enum`." },
            {
              run:
`#include <stdio.h>

#define MAX_LINE 80

int main(void) {
  enum { TAB_WIDTH = 8 };
  const double pi = 3.1415926535;

  printf("max=%d tab=%d pi=%.3f\\n", MAX_LINE, TAB_WIDTH, pi);
  return 0;
}`,
              title: "constants.c",
            },
            { h2: "Integer arithmetic" },
            { p: "If both operands are integers, `/` performs integer division and `%` gives the remainder. Cast one operand to `double` when you need a fractional result." },
            {
              run:
`#include <stdio.h>

int main(void) {
  int a = 17;
  int b = 5;
  double exact;

  exact = (double) a / b;
  printf("a / b = %d\\n", a / b);
  printf("a %% b = %d\\n", a % b);
  printf("exact = %.2f\\n", exact);
  return 0;
}`,
              title: "arithmetic.c",
            },
            { h2: "Bitwise operators" },
            { p: "C exposes bit-level operations: `&` and, `|` or, `^` exclusive-or, `~` complement, `<<` left shift, and `>>` right shift. They are common in systems code, flags, masks, and packed data." },
            {
              run:
`#include <stdio.h>

int main(void) {
  unsigned int flags = 0;

  flags = flags | 1U;      /* set bit 0 */
  flags = flags | 4U;      /* set bit 2 */
  printf("flags=%u\\n", flags);
  printf("bit 2 set? %s\\n", (flags & 4U) ? "yes" : "no");
  return 0;
}`,
              title: "bits.c",
            },
            { warn: "Operator precedence is easy to misread. Parenthesize expressions such as `(flags & MASK) != 0` instead of relying on memory." },
          ],
        },
      ],
    },

    {
      title: "Control Flow",
      lessons: [
        {
          id: "c-control",
          eyebrow: "Module 3 · Flow",
          title: "Selection and Loops",
          lede: "Control flow gives C programs shape: choose paths with `if` and `switch`, repeat work with loops.",
          blocks: [
            { h2: "if, else-if, and switch" },
            {
              run:
`#include <stdio.h>

int main(void) {
  int score = 72;

  if (score >= 90) {
    puts("A");
  } else if (score >= 70) {
    puts("B");
  } else {
    puts("Needs more practice");
  }
  return 0;
}`,
              title: "if_else.c",
            },
            { p: "`switch` compares one integer-like expression against `case` labels. Put `break` at the end of each case unless fall-through is intentional." },
            {
              run:
`#include <stdio.h>

int main(void) {
  int command = 2;

  switch (command) {
    case 1: puts("add"); break;
    case 2: puts("list"); break;
    case 3: puts("quit"); break;
    default: puts("unknown"); break;
  }
  return 0;
}`,
              title: "switch.c",
            },
            { h2: "while, for, and do-while" },
            {
              run:
`#include <stdio.h>

int main(void) {
  int i;

  for (i = 1; i <= 5; i = i + 1) {
    printf("%d ", i);
  }
  printf("\\n");
  return 0;
}`,
              title: "for_loop.c",
            },
            {
              exercise: {
                title: "sum_to_n.c",
                prompt: "Read an integer `n` and print the sum of the integers from 1 through `n`. If `n` is less than 1, print 0.",
                code:
`#include <stdio.h>

int main(void) {
  int n;
  int i;
  int sum = 0;

  scanf("%d", &n);
  /* TODO: add 1 + 2 + ... + n into sum */
  printf("%d", sum);
  return 0;
}`,
                tests: [
                  { name: "sum 5", stdin: "5", expected: "15" },
                  { name: "sum 1", stdin: "1", expected: "1" },
                  { name: "sum 10", stdin: "10", expected: "55" },
                  { name: "negative gives zero", stdin: "-3", expected: "0" },
                ],
                hint: "Use `for (i = 1; i <= n; i = i + 1) sum = sum + i;`. If `n < 1`, the loop body never runs.",
                solution:
`#include <stdio.h>

int main(void) {
  int n;
  int i;
  int sum = 0;

  scanf("%d", &n);
  for (i = 1; i <= n; i = i + 1) {
    sum = sum + i;
  }
  printf("%d", sum);
  return 0;
}`,
              },
            },
            {
              quiz: {
                q: "What happens if a switch case omits break?",
                options: ["The program will not compile", "Execution falls through into the next case", "The switch restarts", "The variable becomes zero"],
                answer: 1,
                explain: "Without `break`, control continues into the statements for following cases until a break or the switch ends.",
              },
            },
          ],
        },
      ],
    },

    {
      title: "Functions & Program Structure",
      lessons: [
        {
          id: "c-functions",
          eyebrow: "Module 4 · Functions",
          title: "Functions, Prototypes, and Call by Value",
          lede: "Functions divide a program into named operations. C passes arguments by value, so pointer arguments are how functions modify caller data.",
          blocks: [
            { p: "A function declaration, often called a [[prototype||A declaration that tells the compiler a function's return type and parameter types before the function is called.]], lets the compiler check calls before it has seen the function body." },
            {
              run:
`#include <stdio.h>

int square(int x);

int main(void) {
  printf("%d\\n", square(7));
  return 0;
}

int square(int x) {
  return x * x;
}`,
              title: "prototype.c",
            },
            { h2: "Call by value" },
            { p: "C copies each argument into the called function's parameter. Changing the parameter does not change the caller's variable." },
            {
              run:
`#include <stdio.h>

void add_one_copy(int x) {
  x = x + 1;
}

void add_one_pointer(int *x) {
  *x = *x + 1;
}

int main(void) {
  int n = 10;

  add_one_copy(n);
  printf("%d\\n", n);
  add_one_pointer(&n);
  printf("%d\\n", n);
  return 0;
}`,
              title: "call_by_value.c",
            },
            {
              exercise: {
                title: "clamp.c",
                prompt: "Complete `clamp(x, lo, hi)`. It should return `lo` if `x` is too small, `hi` if `x` is too large, otherwise `x`.",
                code:
`#include <stdio.h>

int clamp(int x, int lo, int hi) {
  /* TODO */
  return 0;
}

int main(void) {
  int x;
  int lo;
  int hi;
  scanf("%d %d %d", &x, &lo, &hi);
  printf("%d", clamp(x, lo, hi));
  return 0;
}`,
                tests: [
                  { name: "inside range", stdin: "5 1 10", expected: "5" },
                  { name: "below range", stdin: "-4 0 9", expected: "0" },
                  { name: "above range", stdin: "20 0 9", expected: "9" },
                  { name: "on boundary", stdin: "7 7 9", expected: "7" },
                ],
                hint: "Use two `if` statements before the final return.",
                solution:
`#include <stdio.h>

int clamp(int x, int lo, int hi) {
  if (x < lo) return lo;
  if (x > hi) return hi;
  return x;
}

int main(void) {
  int x;
  int lo;
  int hi;
  scanf("%d %d %d", &x, &lo, &hi);
  printf("%d", clamp(x, lo, hi));
  return 0;
}`,
              },
            },
          ],
        },
        {
          id: "c-scope",
          eyebrow: "Module 4 · Structure",
          title: "Scope, Linkage, and Storage Duration",
          lede: "Names in C have scope and linkage. Objects also have lifetimes: automatic, static, or allocated.",
          blocks: [
            { p: "A local variable inside a block has [[automatic storage duration||It is created when execution enters the block and destroyed when execution leaves. Most local variables work this way.]]. A file-scope variable or a variable declared `static` has static storage duration: it exists for the whole program run." },
            {
              run:
`#include <stdio.h>

static int next_id_value = 0;  /* visible only in this source file */

int next_id(void) {
  next_id_value = next_id_value + 1;
  return next_id_value;
}

int main(void) {
  printf("%d\\n", next_id());
  printf("%d\\n", next_id());
  return 0;
}`,
              title: "static_file_scope.c",
            },
            { p: "`static` at file scope gives a name internal linkage, hiding it from other translation units. `static` inside a function makes a local variable keep its value between calls." },
            {
              run:
`#include <stdio.h>

int calls(void) {
  static int count = 0;
  count = count + 1;
  return count;
}

int main(void) {
  printf("%d %d %d\\n", calls(), calls(), calls());
  return 0;
}`,
              title: "static_local.c",
            },
            { tip: "Use file-scope `static` for helper functions and private data that should not be exported from a `.c` file." },
          ],
        },
        {
          id: "c-preprocessor",
          eyebrow: "Module 4 · Build",
          title: "Header Files and the Preprocessor",
          lede: "The preprocessor runs before compilation. It handles includes, macro replacement, and conditional compilation.",
          blocks: [
            { p: "`#include` copies declarations from another file into the current translation unit. Header files usually contain function prototypes, type definitions, constants, and include guards." },
            { code:
`#ifndef TEXT_STATS_H
#define TEXT_STATS_H

typedef struct Stats Stats;
void stats_init(Stats *s);
void stats_print(const Stats *s);

#endif`,
              title: "text_stats.h" },
            { h2: "Macros" },
            { p: "Macros perform token substitution. Object-like macros can name constants; function-like macros can be useful but dangerous because arguments may be evaluated more than once." },
            { code:
`#define BUFFER_SIZE 1024
#define MAX(a, b) ((a) > (b) ? (a) : (b))`,
              title: "macros.c" },
            { warn: "Prefer functions when you need type checking or single evaluation. Use macros for conditional compilation, include guards, and simple compile-time constants." },
            {
              quiz: {
                q: "Why do header files use include guards?",
                options: ["To encrypt declarations", "To prevent double inclusion in one translation unit", "To make code run faster", "To allocate static storage"],
                answer: 1,
                explain: "An include guard makes repeated inclusion harmless by defining the header's contents only once per translation unit.",
              },
            },
          ],
        },
      ],
    },

    {
      title: "Arrays, Strings & Pointers",
      lessons: [
        {
          id: "c-arrays",
          eyebrow: "Module 5 · Arrays",
          title: "Arrays and Character Arrays",
          lede: "An array stores contiguous elements of one type. C strings are character arrays ending with a null character.",
          blocks: [
            {
              run:
`#include <stdio.h>

int main(void) {
  int scores[5] = { 9, 7, 10, 8, 6 };
  int i;
  int total = 0;

  for (i = 0; i < 5; i = i + 1) {
    total = total + scores[i];
  }
  printf("average %.1f\\n", total / 5.0);
  return 0;
}`,
              title: "arrays.c",
            },
            { p: "Array indices start at zero. C does not check bounds: reading or writing past the end is undefined behaviour." },
            {
              exercise: {
                title: "max_array.c",
                prompt: "Read `n`, then read `n` integers into an array of at most 100 elements. Print the maximum value. The tests always provide at least one number.",
                code:
`#include <stdio.h>

int main(void) {
  int values[100];
  int n;
  int i;
  int max;

  scanf("%d", &n);
  for (i = 0; i < n; i = i + 1) {
    scanf("%d", &values[i]);
  }

  /* TODO: find the maximum */
  max = 0;

  printf("%d", max);
  return 0;
}`,
                tests: [
                  { name: "positive values", stdin: "5 1 8 3 2 5", expected: "8" },
                  { name: "negative values", stdin: "4 -9 -2 -30 -4", expected: "-2" },
                  { name: "one value", stdin: "1 42", expected: "42" },
                  { name: "last is max", stdin: "6 1 2 3 4 5 99", expected: "99" },
                ],
                hint: "Start with `max = values[0]`, then scan the rest.",
                solution:
`#include <stdio.h>

int main(void) {
  int values[100];
  int n;
  int i;
  int max;

  scanf("%d", &n);
  for (i = 0; i < n; i = i + 1) {
    scanf("%d", &values[i]);
  }

  max = values[0];
  for (i = 1; i < n; i = i + 1) {
    if (values[i] > max) {
      max = values[i];
    }
  }

  printf("%d", max);
  return 0;
}`,
              },
            },
          ],
        },
        {
          id: "c-strings",
          eyebrow: "Module 5 · Text",
          title: "Strings and the Standard String Library",
          lede: "A C string is a `char` array whose last character is `\\0`. The library can measure, copy, compare, and search strings.",
          blocks: [
            {
              run:
`#include <stdio.h>
#include <string.h>

int main(void) {
  char name[32] = "Ada";
  char greeting[64] = "Hello, ";

  strcat(greeting, name);
  printf("%s\\n", greeting);
  printf("length=%lu\\n", (unsigned long) strlen(greeting));
  return 0;
}`,
              title: "strings.c",
            },
            { warn: "`strcpy` and `strcat` assume the destination array is large enough. In real programs, track buffer sizes carefully and prefer bounded alternatives where available." },
            {
              run:
`#include <stdio.h>

int main(void) {
  char word[] = "systems";
  int i;

  for (i = 0; word[i] != '\\0'; i = i + 1) {
    putchar(word[i]);
    putchar('\\n');
  }
  return 0;
}`,
              title: "char_array.c",
            },
            {
              quiz: {
                q: "What marks the end of a C string?",
                options: ["EOF", "A newline", "The null character '\\0'", "The array's declared size"],
                answer: 2,
                explain: "String functions scan until they find the null terminator `\\0`.",
              },
            },
          ],
        },
        {
          id: "c-pointers",
          eyebrow: "Module 5 · Pointers",
          title: "Pointers and Addresses",
          lede: "A pointer stores the address of an object. Pointers are central to arrays, strings, dynamic memory, and efficient APIs.",
          blocks: [
            {
              run:
`#include <stdio.h>

int main(void) {
  int x = 42;
  int *p = &x;

  printf("x = %d\\n", x);
  printf("*p = %d\\n", *p);
  *p = 99;
  printf("x = %d\\n", x);
  return 0;
}`,
              title: "pointers.c",
            },
            { diagram: "pointers", caption: "`p` stores the address of `x`. Dereferencing with `*p` accesses the object at that address." },
            { p: "`&x` produces the address of `x`; `*p` dereferences the pointer. A pointer must point to a valid object before you dereference it." },
            {
              exercise: {
                title: "strlen_pointer.c",
                prompt: "Complete `c_strlen` using pointer traversal. It should return the number of characters before the terminating `\\0`.",
                code:
`#include <stdio.h>
#include <stddef.h>

size_t c_strlen(const char *s) {
  /* TODO */
  return 0;
}

int main(void) {
  char input[128];
  if (fgets(input, sizeof input, stdin) == NULL) {
    return 1;
  }
  printf("%lu", (unsigned long) c_strlen(input));
  return 0;
}`,
                tests: [
                  { name: "three letters plus newline", stdin: "cat\n", expected: "4" },
                  { name: "empty line", stdin: "\n", expected: "1" },
                  { name: "word", stdin: "systems", expected: "7" },
                  { name: "spaces count", stdin: "a b c", expected: "5" },
                ],
                hint: "Keep a second pointer at the start, advance `s` until `*s == '\\0'`, then subtract.",
                solution:
`#include <stdio.h>
#include <stddef.h>

size_t c_strlen(const char *s) {
  const char *start = s;
  while (*s != '\\0') {
    s = s + 1;
  }
  return (size_t) (s - start);
}

int main(void) {
  char input[128];
  if (fgets(input, sizeof input, stdin) == NULL) {
    return 1;
  }
  printf("%lu", (unsigned long) c_strlen(input));
  return 0;
}`,
              },
            },
          ],
        },
        {
          id: "c-pointer-arrays",
          eyebrow: "Module 5 · Arrays",
          title: "Pointer Arithmetic and Arrays",
          lede: "In expressions, an array name usually becomes a pointer to its first element. Pointer arithmetic moves by element size.",
          blocks: [
            {
              run:
`#include <stdio.h>

int main(void) {
  int values[] = { 10, 20, 30 };
  int *p = values;
  int i;

  for (i = 0; i < 3; i = i + 1) {
    printf("%d ", *(p + i));
  }
  printf("\\n");
  return 0;
}`,
              title: "pointer_arithmetic.c",
            },
            { p: "`values[i]` is defined in terms of pointer arithmetic: it means `*(values + i)`. The compiler scales `i` by the size of the element type." },
            {
              run:
`#include <stdio.h>

int main(void) {
  const char *names[] = { "Ada", "Ken", "Dennis" };
  int i;

  for (i = 0; i < 3; i = i + 1) {
    printf("%s\\n", names[i]);
  }
  return 0;
}`,
              title: "pointer_array.c",
            },
            { warn: "Pointer arithmetic is only defined within one array object, plus one position past the end. Do not compare or subtract unrelated pointers." },
          ],
        },
        {
          id: "c-dynamic-memory",
          eyebrow: "Module 5 · Memory",
          title: "Dynamic Memory with malloc and free",
          lede: "When an array size is known only at runtime, request storage from the heap and release it when done.",
          blocks: [
            {
              run:
`#include <stdio.h>
#include <stdlib.h>

int main(void) {
  int n = 5;
  int *values;
  int i;

  values = (int *) malloc((unsigned long) n * sizeof values[0]);
  if (values == NULL) {
    fprintf(stderr, "allocation failed\\n");
    return 1;
  }

  for (i = 0; i < n; i = i + 1) {
    values[i] = i * i;
    printf("%d ", values[i]);
  }
  printf("\\n");
  free(values);
  return 0;
}`,
              title: "malloc.c",
            },
            { p: "`malloc` returns `NULL` if allocation fails. Every successful allocation should have one matching `free` when the storage is no longer needed." },
            { diagram: "memory", caption: "Local pointer variables live on the stack; `malloc` returns an address in heap storage that you later pass to `free`." },
            { danger: "Using memory after `free`, freeing the same pointer twice, or writing beyond the allocated block causes undefined behaviour." },
          ],
        },
      ],
    },

    {
      title: "Structures & Unions",
      lessons: [
        {
          id: "c-structures",
          eyebrow: "Module 6 · Records",
          title: "Structures and Pointers to Structures",
          lede: "A `struct` groups related objects into one record. Pass large structures by pointer to avoid copying.",
          blocks: [
            {
              run:
`#include <stdio.h>

struct Point {
  int x;
  int y;
};

void move(struct Point *p, int dx, int dy) {
  p->x = p->x + dx;
  p->y = p->y + dy;
}

int main(void) {
  struct Point pt = { 3, 4 };

  move(&pt, 2, -1);
  printf("(%d, %d)\\n", pt.x, pt.y);
  return 0;
}`,
              title: "struct_point.c",
            },
            { p: "Use `.` to access a member through a structure object. Use `->` through a pointer: `p->x` is shorthand for `(*p).x`." },
            {
              exercise: {
                title: "books.c",
                prompt: "Complete `total_pages`. It receives an array of `struct Book` and returns the sum of their page counts.",
                code:
`#include <stdio.h>

struct Book {
  char title[40];
  int pages;
};

int total_pages(const struct Book *books, int n) {
  /* TODO */
  return 0;
}

int main(void) {
  struct Book books[3] = {
    { "C", 272 },
    { "Algorithms", 420 },
    { "Systems", 310 }
  };
  printf("%d", total_pages(books, 3));
  return 0;
}`,
                tests: [
                  { name: "three books", stdin: "", expected: "1002" },
                ],
                hint: "Loop from 0 to `n - 1` and add `books[i].pages`.",
                solution:
`#include <stdio.h>

struct Book {
  char title[40];
  int pages;
};

int total_pages(const struct Book *books, int n) {
  int i;
  int total = 0;
  for (i = 0; i < n; i = i + 1) {
    total = total + books[i].pages;
  }
  return total;
}

int main(void) {
  struct Book books[3] = {
    { "C", 272 },
    { "Algorithms", 420 },
    { "Systems", 310 }
  };
  printf("%d", total_pages(books, 3));
  return 0;
}`,
              },
            },
          ],
        },
        {
          id: "c-typedef-unions",
          eyebrow: "Module 6 · Types",
          title: "typedef, Unions, and Bit-fields",
          lede: "C lets you define clearer type names and compact representations for low-level data.",
          blocks: [
            { p: "`typedef` creates an alias for an existing type. It is often used with structures to make declarations less noisy." },
            {
              run:
`#include <stdio.h>

typedef struct {
  int id;
  double balance;
} Account;

int main(void) {
  Account a = { 1001, 42.50 };
  printf("%d %.2f\\n", a.id, a.balance);
  return 0;
}`,
              title: "typedef.c",
            },
            { p: "A `union` stores different members in the same memory. Only one member's value is meaningful at a time, so unions are usually paired with a tag that records what is stored." },
            {
              run:
`#include <stdio.h>

typedef enum { INT_VALUE, DOUBLE_VALUE } ValueKind;

typedef struct {
  ValueKind kind;
  union {
    int i;
    double d;
  } data;
} Value;

int main(void) {
  Value v;
  v.kind = DOUBLE_VALUE;
  v.data.d = 3.5;
  if (v.kind == DOUBLE_VALUE) {
    printf("%.1f\\n", v.data.d);
  }
  return 0;
}`,
              title: "union.c",
            },
            { tip: "Bit-fields can pack flags into a structure, but their exact layout is implementation-defined. Use them only when that tradeoff is acceptable." },
          ],
        },
      ],
    },

    {
      title: "Input, Output & Library",
      lessons: [
        {
          id: "c-formatted-io",
          eyebrow: "Module 7 · stdio",
          title: "Formatted Input and Output",
          lede: "`printf` and `scanf` convert between binary values and text using format strings.",
          blocks: [
            {
              run:
`#include <stdio.h>

int main(void) {
  int age;
  double height;

  if (scanf("%d %lf", &age, &height) == 2) {
    printf("age=%d height=%.2f\\n", age, height);
  } else {
    puts("bad input");
  }
  return 0;
}`,
              title: "scanf.c",
              stdin: "36 1.82",
            },
            { p: "`scanf` needs addresses so it can store converted values. That is why integer input uses `&age`. Arrays such as character buffers already convert to pointers in expressions." },
            { warn: "Always bound string input. `%s` without a field width can overflow a buffer; prefer `fgets` for line input." },
          ],
        },
        {
          id: "c-files",
          eyebrow: "Module 7 · Files",
          title: "File Access and Error Handling",
          lede: "The standard library represents files as `FILE *` streams opened with `fopen` and closed with `fclose`.",
          blocks: [
            {
              run:
`#include <stdio.h>
#include <stdlib.h>

int main(void) {
  FILE *fp;
  char line[80];

  fp = fopen("notes.txt", "w");
  if (fp == NULL) {
    perror("notes.txt");
    return 1;
  }
  fputs("first\\nsecond\\n", fp);
  fclose(fp);

  fp = fopen("notes.txt", "r");
  if (fp == NULL) {
    perror("notes.txt");
    return 1;
  }
  while (fgets(line, sizeof line, fp) != NULL) {
    printf("read: %s", line);
  }
  fclose(fp);
  return 0;
}`,
              title: "files.c",
            },
            { p: "`perror` prints a message for the current library error state. For command-line tools, send diagnostics to `stderr` and return a non-zero status when something fails." },
            {
              run:
`#include <stdio.h>
#include <stdlib.h>

int main(void) {
  fprintf(stderr, "warning: using sample data\\n");
  printf("result=%d\\n", 42);
  return EXIT_SUCCESS;
}`,
              title: "stderr_exit.c",
            },
          ],
        },
        {
          id: "c-library",
          eyebrow: "Module 7 · Library",
          title: "Useful Standard Library Facilities",
          lede: "The C library is small but essential: strings, character classes, memory, math, and variable argument lists.",
          blocks: [
            {
              run:
`#include <ctype.h>
#include <stdio.h>

int main(void) {
  int c;

  while ((c = getchar()) != EOF) {
    if (islower(c)) {
      c = toupper(c);
    }
    putchar(c);
  }
  return 0;
}`,
              title: "toupper_filter.c",
              stdin: "Hello, C!\\n",
            },
            {
              run:
`#include <stdarg.h>
#include <stdio.h>

int sum_all(int count, ...) {
  va_list ap;
  int i;
  int total = 0;

  va_start(ap, count);
  for (i = 0; i < count; i = i + 1) {
    total = total + va_arg(ap, int);
  }
  va_end(ap);
  return total;
}

int main(void) {
  printf("%d\\n", sum_all(4, 3, 4, 5, 6));
  return 0;
}`,
              title: "varargs.c",
            },
            { tip: "When passing a possibly negative `char` to `<ctype.h>` functions, cast to `unsigned char` first unless the value is `EOF`. The examples here use values returned by `getchar`, which are already `int` values suitable for the test." },
          ],
        },
      ],
    },

    {
      title: "Unix-Style Interfaces",
      lessons: [
        {
          id: "c-command-line",
          eyebrow: "Module 8 · Programs",
          title: "Command-line Arguments",
          lede: "A hosted C program can receive argument strings through `main(int argc, char **argv)`.",
          blocks: [
            {
              run:
`#include <stdio.h>

int main(int argc, char **argv) {
  int i;

  printf("argc=%d\\n", argc);
  for (i = 0; i < argc; i = i + 1) {
    printf("argv[%d]=%s\\n", i, argv[i]);
  }
  return 0;
}`,
              title: "argv.c",
            },
            { p: "The sandbox runs examples without extra command-line arguments, so `argc` is usually 1 and `argv[0]` is the program path. In real shells, arguments after the command fill `argv[1]`, `argv[2]`, and so on." },
          ],
        },
        {
          id: "c-low-level-io",
          eyebrow: "Module 8 · System Calls",
          title: "File Descriptors, read, and write",
          lede: "Below stdio, Unix-like systems expose small integer file descriptors and byte-oriented operations.",
          blocks: [
            { p: "This part of the book is Unix-specific rather than ISO C. It matters because C is often used at the boundary between portable code and operating-system services." },
            {
              run:
`#include <unistd.h>

int main(void) {
  const char msg[] = "hello from write\\n";
  write(1, msg, sizeof msg - 1);
  return 0;
}`,
              title: "write.c",
            },
            { p: "File descriptor `0` is standard input, `1` is standard output, and `2` is standard error. `read` and `write` work with raw bytes; stdio functions like `printf` add buffering and formatting on top." },
            { warn: "Code using `<unistd.h>`, `open`, `read`, `write`, or `lseek` is POSIX/Unix code. It is available in the Linux container but not part of ISO C." },
          ],
        },
      ],
    },

    {
      title: "Capstone Project",
      lessons: [
        {
          id: "c-capstone1",
          eyebrow: "Capstone · Step 1",
          title: "Build a Text Analyzer: Count Words",
          lede: "The capstone is a small text-analysis filter. Start with a function that counts words in one string.",
          blocks: [
            {
              exercise: {
                title: "count_words.c",
                prompt: "Complete `count_words`. A word is a run of non-whitespace characters. Use `<ctype.h>` and cast to `unsigned char` before `isspace`.",
                code:
`#include <ctype.h>
#include <stdio.h>

int count_words(const char *s) {
  int count = 0;
  int in_word = 0;

  /* TODO */

  return count;
}

int main(void) {
  char line[256];
  if (fgets(line, sizeof line, stdin) == NULL) {
    return 1;
  }
  printf("%d", count_words(line));
  return 0;
}`,
                tests: [
                  { name: "three words", stdin: "one two three\n", expected: "3" },
                  { name: "leading spaces", stdin: "   spaced words\n", expected: "2" },
                  { name: "blank", stdin: "\n", expected: "0" },
                  { name: "tabs", stdin: "a\tb\tc", expected: "3" },
                ],
                hint: "When you see whitespace, leave word mode. When you see a non-whitespace character while outside a word, count a new word and enter word mode.",
                solution:
`#include <ctype.h>
#include <stdio.h>

int count_words(const char *s) {
  int count = 0;
  int in_word = 0;

  while (*s != '\\0') {
    if (isspace((unsigned char) *s)) {
      in_word = 0;
    } else if (!in_word) {
      in_word = 1;
      count = count + 1;
    }
    s = s + 1;
  }

  return count;
}

int main(void) {
  char line[256];
  if (fgets(line, sizeof line, stdin) == NULL) {
    return 1;
  }
  printf("%d", count_words(line));
  return 0;
}`,
              },
            },
          ],
        },
        {
          id: "c-capstone2",
          eyebrow: "Capstone · Step 2",
          title: "Track Lines, Words, Characters, and Longest Line",
          lede: "Add a structure that accumulates statistics as each input line arrives.",
          blocks: [
            {
              exercise: {
                title: "stats_update.c",
                prompt: "Complete `update_stats`. It should increment line count, add the line's byte length to `chars`, add words from `count_words`, and update `longest` excluding a trailing newline.",
                code:
`#include <ctype.h>
#include <stdio.h>
#include <string.h>

typedef struct {
  int lines;
  int words;
  int chars;
  int longest;
} Stats;

int count_words(const char *s) {
  int count = 0;
  int in_word = 0;
  while (*s != '\\0') {
    if (isspace((unsigned char) *s)) in_word = 0;
    else if (!in_word) { in_word = 1; count = count + 1; }
    s = s + 1;
  }
  return count;
}

void update_stats(Stats *st, const char *line) {
  int len;
  int visible;

  /* TODO */
}

int main(void) {
  Stats st = { 0, 0, 0, 0 };
  update_stats(&st, "hello c\\n");
  update_stats(&st, "second line\\n");
  printf("%d %d %d %d", st.lines, st.words, st.chars, st.longest);
  return 0;
}`,
                tests: [
                  { name: "two fixed lines", stdin: "", expected: "2 4 20 11" },
                ],
                hint: "`len = (int) strlen(line); visible = len; if visible > 0 and the last char is '\\n', subtract one for longest-line comparison.",
                solution:
`#include <ctype.h>
#include <stdio.h>
#include <string.h>

typedef struct {
  int lines;
  int words;
  int chars;
  int longest;
} Stats;

int count_words(const char *s) {
  int count = 0;
  int in_word = 0;
  while (*s != '\\0') {
    if (isspace((unsigned char) *s)) in_word = 0;
    else if (!in_word) { in_word = 1; count = count + 1; }
    s = s + 1;
  }
  return count;
}

void update_stats(Stats *st, const char *line) {
  int len;
  int visible;

  len = (int) strlen(line);
  visible = len;
  if (visible > 0 && line[visible - 1] == '\\n') {
    visible = visible - 1;
  }
  st->lines = st->lines + 1;
  st->words = st->words + count_words(line);
  st->chars = st->chars + len;
  if (visible > st->longest) {
    st->longest = visible;
  }
}

int main(void) {
  Stats st = { 0, 0, 0, 0 };
  update_stats(&st, "hello c\\n");
  update_stats(&st, "second line\\n");
  printf("%d %d %d %d", st.lines, st.words, st.chars, st.longest);
  return 0;
}`,
              },
            },
          ],
        },
        {
          id: "c-capstone3",
          eyebrow: "Capstone · Step 3",
          title: "The Complete Text Analyzer",
          lede: "Finish the filter: read all lines from standard input and print a clear report.",
          blocks: [
            {
              exercise: {
                title: "text_analyzer.c",
                prompt: "Complete the input loop. Read every line with `fgets`, update the stats, then print `lines`, `words`, `chars`, and `longest` exactly as shown by the tests.",
                code:
`#include <ctype.h>
#include <stdio.h>
#include <string.h>

typedef struct {
  int lines;
  int words;
  int chars;
  int longest;
} Stats;

int count_words(const char *s) {
  int count = 0;
  int in_word = 0;
  while (*s != '\\0') {
    if (isspace((unsigned char) *s)) in_word = 0;
    else if (!in_word) { in_word = 1; count = count + 1; }
    s = s + 1;
  }
  return count;
}

void update_stats(Stats *st, const char *line) {
  int len = (int) strlen(line);
  int visible = len;
  if (visible > 0 && line[visible - 1] == '\\n') visible = visible - 1;
  st->lines = st->lines + 1;
  st->words = st->words + count_words(line);
  st->chars = st->chars + len;
  if (visible > st->longest) st->longest = visible;
}

int main(void) {
  Stats st = { 0, 0, 0, 0 };
  char line[256];

  /* TODO: read all lines and call update_stats */

  printf("lines=%d\\n", st.lines);
  printf("words=%d\\n", st.words);
  printf("chars=%d\\n", st.chars);
  printf("longest=%d\\n", st.longest);
  return 0;
}`,
                tests: [
                  { name: "two lines", stdin: "hello c\nsecond line\n", expected: "lines=2\nwords=4\nchars=20\nlongest=11" },
                  { name: "blank line included", stdin: "one\n\nthree four", expected: "lines=3\nwords=3\nchars=15\nlongest=10" },
                  { name: "empty input", stdin: "", expected: "lines=0\nwords=0\nchars=0\nlongest=0" },
                ],
                hint: "`while (fgets(line, sizeof line, stdin) != NULL) update_stats(&st, line);`",
                solution:
`#include <ctype.h>
#include <stdio.h>
#include <string.h>

typedef struct {
  int lines;
  int words;
  int chars;
  int longest;
} Stats;

int count_words(const char *s) {
  int count = 0;
  int in_word = 0;
  while (*s != '\\0') {
    if (isspace((unsigned char) *s)) in_word = 0;
    else if (!in_word) { in_word = 1; count = count + 1; }
    s = s + 1;
  }
  return count;
}

void update_stats(Stats *st, const char *line) {
  int len = (int) strlen(line);
  int visible = len;
  if (visible > 0 && line[visible - 1] == '\\n') visible = visible - 1;
  st->lines = st->lines + 1;
  st->words = st->words + count_words(line);
  st->chars = st->chars + len;
  if (visible > st->longest) st->longest = visible;
}

int main(void) {
  Stats st = { 0, 0, 0, 0 };
  char line[256];

  while (fgets(line, sizeof line, stdin) != NULL) {
    update_stats(&st, line);
  }

  printf("lines=%d\\n", st.lines);
  printf("words=%d\\n", st.words);
  printf("chars=%d\\n", st.chars);
  printf("longest=%d\\n", st.longest);
  return 0;
}`,
              },
            },
            { p: "This finished program combines the course's core ideas: streams, arrays, strings, pointers, functions, structures, library calls, and careful error-conscious C style." },
          ],
        },
      ],
    },

    {
      title: "Reference & Next Steps",
      lessons: [
        {
          id: "c-reference",
          eyebrow: "Module 9 · Reference",
          title: "Reading C Declarations",
          lede: "C declarations can be dense because arrays, pointers, and functions combine recursively.",
          blocks: [
            { p: "A useful rule is to start at the identifier and spiral outward, respecting parentheses. `int *p[10]` is an array of 10 pointers to int. `int (*p)[10]` is a pointer to an array of 10 int." },
            { code:
`int *a[10];        /* array of 10 pointers to int */
int (*b)[10];      /* pointer to array of 10 int */
int *f(void);      /* function returning pointer to int */
int (*g)(void);    /* pointer to function returning int */`,
              title: "declarations.c" },
            { tip: "When a declaration becomes hard to read, introduce a `typedef` for one layer of the idea. Clarity matters more than showing off declarator syntax." },
          ],
        },
        {
          id: "c-next",
          eyebrow: "You did it",
          title: "Where to Go Next with C",
          lede: "You now have the core of C: expressions, control flow, functions, arrays, pointers, structures, I/O, and system interfaces.",
          blocks: [
            { h2: "Build something small" },
            { ul: [
              "A line-based TODO file manager using `fgets`, `FILE *`, and structures.",
              "A tiny `grep`-style filter that searches standard input.",
              "A dynamic array library using `malloc`, `realloc`, and `free`.",
              "A tokenizer for arithmetic expressions using pointers and character classes.",
            ]},
            { h2: "Deepen the fundamentals" },
            { ul: [
              "Read compiler warnings carefully and compile with `-Wall -Wextra`.",
              "Practice pointer diagrams until array/pointer relationships feel mechanical.",
              "Learn a debugger such as `gdb` or the debugger built into your IDE.",
              "Study undefined behaviour, object lifetimes, integer conversions, and ownership conventions.",
            ]},
            { p: "**Well done.** Mark this lesson complete to finish the C course at 100%." },
          ],
        },
      ],
    },
  ];

  window.CCourseData = MODULES;
})();
