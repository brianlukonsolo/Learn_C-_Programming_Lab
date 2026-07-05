/* ============================================================
   C++ Academy — course content
   Structure mirrors the cplusplus.com C++ Language Tutorial.

   Inline prose markup:
     `code`                  -> inline code
     [[term||explanation]]   -> tooltip term (hover/focus for detail)
     **bold**                -> bold

   Block types: h2, h3, p, ul, ol, tip, warn, danger, code, run, quiz,
                hero, roadmap
   ============================================================ */
(function () {
  "use strict";

  var MODULES = [
    /* ---------------------------------------------------------- */
    {
      title: "Getting Started",
      lessons: [
        {
          id: "home",
          nav: "Welcome",
          blocks: [{ hero: true }, { roadmap: true }],
        },
        {
          id: "structure",
          eyebrow: "Module 1 · Basics",
          title: "The Structure of a Program",
          lede: "Every C++ program shares the same skeleton. Learn it once and you can read any example in this course.",
          blocks: [
            { p: "The best way to start a language is to run something. Here is the classic first program — it prints a line of text to the screen." },
            {
              run:
`// my first program in C++
#include <iostream>
using namespace std;

int main() {
  cout << "Hello World!";
  return 0;
}`,
              title: "hello.cpp",
            },
            { p: "Click **▶ Run** above. The server compiles it with `g++` and shows the output. Now let's read it line by line." },
            { h2: "Line by line" },
            { p: "`// my first program` — a [[comment||Text the compiler ignores. Use `//` for a single line, or `/* ... */` to span multiple lines. Comments explain *why* code exists.]]. Anything after `//` is ignored by the compiler." },
            { p: "`#include <iostream>` — a [[preprocessor directive||Lines starting with `#` are handled before compilation. `#include` pastes the contents of another file into yours. `<iostream>` gives you input/output streams like `cout` and `cin`.]]. It pulls in the standard input/output library so we can use `cout`." },
            { p: "`using namespace std;` — lets us write `cout` instead of [[std::cout||The standard library lives inside the `std` namespace. Without this line you must prefix names with `std::`, e.g. `std::cout`. It is fine for learning; large projects often avoid it to prevent name clashes.]]." },
            { p: "`int main() { ... }` — the [[main function||Execution always begins at `main`. Every C++ program has exactly one. The `int` means it returns an integer status code to the operating system.]]. Its body runs when the program starts." },
            { p: "`cout << \"Hello World!\";` — sends text to the console. `cout` is the output stream and `<<` is the [[insertion operator||The `<<` operator \"inserts\" whatever is on its right into the stream on its left. You can chain it: `cout << a << b << c;`.]]." },
            { p: "`return 0;` — ends `main` and reports success (`0`) to the operating system. A non-zero value signals an error." },
            { h2: "Statements and blocks" },
            { p: "C++ ignores extra spaces and newlines — what matters is structure. Two rules cover most of it:" },
            { ul: [
              "Most **statements** end with a semicolon `;`.",
              "Curly braces `{ }` group statements into a **block**, like the body of `main`.",
            ]},
            { tip: "Whitespace is free. `int main(){cout<<\"Hi\";}` works too — but consistent indentation makes code readable. Pick a style and keep it." },
            { h2: "Try it yourself" },
            { p: "Edit the program below to print your own name on a second line, then run it. Hint: a second `cout` and `endl` (or `\"\\n\"`) starts a new line." },
            {
              run:
`#include <iostream>
using namespace std;

int main() {
  cout << "Hello World!" << endl;
  // add a line here
  return 0;
}`,
              title: "practice.cpp",
            },
            {
              quiz: {
                q: "Where does a C++ program begin executing?",
                options: ["At the first #include", "At the main() function", "At the top of the file", "At using namespace std"],
                answer: 1,
                explain: "Regardless of file order, execution always starts in main().",
              },
            },
          ],
        },
        {
          id: "io",
          eyebrow: "Module 1 · Basics",
          title: "Basic Input & Output",
          lede: "Talk to the user: print results with cout and read input with cin.",
          blocks: [
            { p: "C++ models console I/O as **streams**. You insert data into `cout` with `<<` and extract data from `cin` with `>>`." },
            { h2: "Output with cout" },
            { p: "Chain as many values as you like. `endl` ends the line and flushes the buffer; `\"\\n\"` is a lighter newline." },
            {
              run:
`#include <iostream>
using namespace std;

int main() {
  int age = 21;
  cout << "You are " << age << " years old.\\n";
  cout << "Pi is about " << 3.14159 << endl;
  return 0;
}`,
              title: "output.cpp",
            },
            { h2: "Input with cin" },
            { p: "`cin >> x` reads a value from the keyboard into `x`. The [[extraction operator||`>>` skips leading whitespace then reads one whitespace-delimited token, converting it to the variable's type. Reading into an `int` stops at the first non-digit.]] knows the type of the variable and converts the text for you." },
            { p: "The runnable box below has a **Standard input** field — type the values the program will read, then run." },
            {
              run:
`#include <iostream>
using namespace std;

int main() {
  int a, b;
  cout << "Enter two numbers:\\n";
  cin >> a >> b;
  cout << "Sum = " << a + b << endl;
  return 0;
}`,
              title: "input.cpp",
              stdin: "7\n5",
            },
            { warn: "`cin >> name` reads only up to the first space. To read a whole line including spaces, use `getline(cin, line)` with a `std::string`." },
            {
              run:
`#include <iostream>
#include <string>
using namespace std;

int main() {
  string fullName;
  cout << "Your full name: ";
  getline(cin, fullName);
  cout << "Hello, " << fullName << "!" << endl;
  return 0;
}`,
              title: "getline.cpp",
              stdin: "Ada Lovelace",
            },
            {
              quiz: {
                q: "Which operator extracts input from cin into a variable?",
                options: ["<<", ">>", "->", "=="],
                answer: 1,
                explain: "cin uses >> (extraction). cout uses << (insertion). A handy mnemonic: the arrows point in the direction the data flows.",
              },
            },
          ],
        },
      ],
    },

    /* ---------------------------------------------------------- */
    {
      title: "Variables & Types",
      lessons: [
        {
          id: "variables",
          eyebrow: "Module 2 · Data",
          title: "Variables & Data Types",
          lede: "A variable is a named box in memory. Its type decides what fits inside and how big the box is.",
          blocks: [
            { p: "To use a variable you first **declare** it with a type and a name. You may **initialise** it in the same line." },
            {
              run:
`#include <iostream>
using namespace std;

int main() {
  int    count = 10;     // whole number
  double price = 4.99;   // floating point
  char   grade = 'A';    // single character
  bool   passed = true;  // true or false

  cout << count << " items at $" << price << " each\\n";
  cout << "Grade " << grade << ", passed: " << passed << endl;
  return 0;
}`,
              title: "types.cpp",
            },
            { h2: "The fundamental types" },
            { ul: [
              "`int` — whole numbers like `-3`, `0`, `42`.",
              "`double` — floating-point numbers for measurements and calculations with decimals, like `3.14`. (`float` is a smaller, less precise cousin.)",
              "`char` — a single character in single quotes: `'A'`.",
              "`bool` — `true` or `false`.",
              "`std::string` — text managed by the standard library (needs `#include <string>`).",
            ]},
            { p: "Modifiers tweak size and sign: [[unsigned||`unsigned` means the value can never be negative. On a common 32-bit `int`, `unsigned int` holds 0…4,294,967,295 instead of roughly -2.1 billion…+2.1 billion. The exact size of `int` is implementation-defined, so use fixed-width types like `std::uint32_t` when the width matters.]] removes negatives, while [[long / short||These adjust the minimum range an integer type must support. `long long` guarantees at least 64 bits for very large numbers; `short` is smaller.]] change the range." },
            { h2: "Let the compiler infer: auto" },
            { p: "`auto` tells the compiler to deduce the type from the initialiser. Handy when the type is obvious or verbose." },
            {
              run:
`#include <iostream>
using namespace std;

int main() {
  auto x = 42;       // int
  auto y = 3.14;     // double
  auto name = "Sam"; // const char*
  cout << x << " " << y << " " << name << endl;
  return 0;
}`,
              title: "auto.cpp",
            },
            { h3: "Scope" },
            { p: "A variable lives only inside the [[block||The region between the `{` and `}` where a name is visible. Variables declared inside a block vanish when the block ends — this is called *local scope*.]] where it is declared. Outside that block, the name is unknown." },
            { tip: "Always initialise your variables. Reading an uninitialised local `int` has undefined behaviour, a classic source of bugs." },
            {
              quiz: {
                q: "Which type best stores an approximate measurement like 1052.37?",
                options: ["int", "char", "double", "bool"],
                answer: 2,
                explain: "double stores floating-point values with decimals. For exact money, prefer integer cents or a decimal/fixed-point library instead of binary floating point.",
              },
            },
          ],
        },
        {
          id: "constants",
          eyebrow: "Module 2 · Data",
          title: "Constants",
          lede: "Some values should never change. Make that a promise the compiler enforces.",
          blocks: [
            { p: "A [[literal||A value written directly in the source code: `42`, `3.14`, `'A'`, `\"hi\"`, `true`. Literals have types just like variables.]] is a fixed value typed straight into your code. A named constant gives such a value a meaningful name." },
            { h2: "const" },
            { p: "Prefix a declaration with `const` and the compiler forbids any later change. Try uncommenting the assignment below — it won't compile." },
            {
              run:
`#include <iostream>
using namespace std;

int main() {
  const double PI = 3.14159;
  double r = 2.0;
  cout << "Area = " << PI * r * r << endl;
  // PI = 3.0;  // <- uncomment: error, PI is const
  return 0;
}`,
              title: "const.cpp",
            },
            { h2: "constexpr" },
            { p: "[[constexpr||\"Constant expression\" — the value must be computable at compile time. This can make programs faster and lets the value be used where the compiler needs a constant, such as array sizes.]] is a stronger promise: the value is fixed *at compile time*." },
            { code:
`constexpr int MAX_USERS = 100;
int scores[MAX_USERS];   // OK: size known at compile time`,
              title: "constexpr.cpp" },
            { h2: "#define (the old way)" },
            { p: "The preprocessor can also define constants by text substitution. It works but skips type checking, so prefer `const`/`constexpr` in modern C++." },
            { code:
`#define PI 3.14159   // text replacement, no type
const double pi = 3.14159;  // preferred: typed & scoped`,
              title: "define.cpp" },
            { tip: "Naming constants in UPPER_CASE is a common convention so they stand out from ordinary variables." },
            {
              quiz: {
                q: "What happens if you try to assign a new value to a const variable?",
                options: ["It silently changes", "The program crashes at runtime", "The compiler reports an error", "It becomes 0"],
                answer: 2,
                explain: "const is enforced at compile time — the code simply won't build, catching the mistake early.",
              },
            },
          ],
        },
      ],
    },

    /* ---------------------------------------------------------- */
    {
      title: "Operators",
      lessons: [
        {
          id: "operators",
          eyebrow: "Module 3 · Expressions",
          title: "Operators",
          lede: "Operators combine values into expressions: arithmetic, comparison, logic, and assignment.",
          blocks: [
            { h2: "Arithmetic" },
            { p: "`+ - * /` do what you expect. `%` is the [[modulo||The remainder after integer division. `7 % 3` is `1`. Great for \"is it even?\" (`n % 2 == 0`) or wrapping values around a range.]] operator." },
            {
              run:
`#include <iostream>
using namespace std;

int main() {
  cout << 7 + 3 << "  " << 7 - 3 << "  " << 7 * 3 << "\\n";
  cout << 7 / 3 << "   (integer division!)\\n";
  cout << 7 % 3 << "   (remainder)\\n";
  cout << 7.0 / 3 << " (double division)\\n";
  return 0;
}`,
              title: "arithmetic.cpp",
            },
            { warn: "`7 / 3` is `2`, not `2.33`. When **both** operands are integers, C++ does integer division and throws away the remainder. Make one a `double` (`7.0 / 3`) to get a real result." },
            { h2: "Assignment & compound assignment" },
            { p: "`=` assigns. The compound forms `+= -= *= /= %=` update a variable in place. `x += 5` means `x = x + 5`." },
            { h2: "Increment & decrement" },
            { p: "`++` adds one, `--` subtracts one. [[Pre vs post||`++x` increments then yields the new value; `x++` yields the old value then increments. Inside a larger expression the difference matters; on its own line they behave the same.]]." },
            {
              run:
`#include <iostream>
using namespace std;

int main() {
  int x = 5;
  x += 3;          // 8
  cout << x << "\\n";
  cout << x++ << "\\n";  // prints 8, then x becomes 9
  cout << ++x << "\\n";  // x becomes 10, prints 10
  return 0;
}`,
              title: "increment.cpp",
            },
            { h2: "Comparison & logical" },
            { p: "Comparisons (`== != < > <= >=`) produce a `bool`. Combine them with logical operators:" },
            { ul: [
              "`&&` — **and** (both must be true)",
              "`||` — **or** (at least one true)",
              "`!`  — **not** (flips true/false)",
            ]},
            { danger: "Use `==` to compare, not `=`. Writing `if (x = 5)` *assigns* 5 to x and is always true — a notorious bug. `==` tests equality." },
            {
              run:
`#include <iostream>
using namespace std;

int main() {
  int age = 20;
  bool canVote = (age >= 18);
  bool teen = (age >= 13 && age <= 19);
  cout << "canVote: " << canVote << ", teen: " << teen << endl;
  return 0;
}`,
              title: "logic.cpp",
            },
            { tip: "When unsure about evaluation order, add parentheses. `(a && b) || c` is clearer than relying on memorised precedence rules." },
            {
              quiz: {
                q: "What is the value of 17 % 5?",
                options: ["3", "2", "3.4", "12"],
                answer: 1,
                explain: "17 divided by 5 is 3 remainder 2. The % operator yields the remainder, so 17 % 5 == 2.",
              },
            },
          ],
        },
      ],
    },

    /* ---------------------------------------------------------- */
    {
      title: "Control Flow",
      lessons: [
        {
          id: "control",
          eyebrow: "Module 4 · Logic",
          title: "Control Structures",
          lede: "Make decisions with if/switch and repeat work with loops. This is where programs come alive.",
          blocks: [
            { h2: "if / else" },
            { p: "Run code only when a condition is true. Add `else` for the alternative, and `else if` to chain choices." },
            {
              run:
`#include <iostream>
using namespace std;

int main() {
  int score = 72;
  if (score >= 90)      cout << "Grade A\\n";
  else if (score >= 70) cout << "Grade B\\n";
  else if (score >= 50) cout << "Grade C\\n";
  else                  cout << "Fail\\n";
  return 0;
}`,
              title: "if.cpp",
            },
            { h2: "while & do-while" },
            { p: "A `while` loop checks the condition **before** each pass. A [[do-while||A loop that runs its body once *before* checking the condition, so the body always executes at least once. Useful for input-validation menus.]] checks **after**, so it always runs at least once." },
            {
              run:
`#include <iostream>
using namespace std;

int main() {
  int n = 1;
  while (n <= 5) {
    cout << n << " ";
    n++;
  }
  cout << endl;
  return 0;
}`,
              title: "while.cpp",
            },
            { h2: "The for loop" },
            { p: "A `for` loop packs initialise, condition, and update into one line — ideal for counting. Read it as: *start; keep going while; after each pass*." },
            {
              run:
`#include <iostream>
using namespace std;

int main() {
  for (int i = 0; i < 5; i++) {
    cout << "i = " << i << "\\n";
  }
  return 0;
}`,
              title: "for.cpp",
            },
            { h3: "Range-based for" },
            { p: "Modern C++ can loop directly over a collection — no index needed." },
            {
              run:
`#include <iostream>
using namespace std;

int main() {
  int nums[] = {10, 20, 30};
  for (int v : nums) cout << v << " ";
  cout << endl;
  return 0;
}`,
              title: "range_for.cpp",
            },
            { h2: "break, continue & switch" },
            { p: "`break` exits a loop immediately; `continue` skips to the next pass. A `switch` compares one value against many `case` labels." },
            {
              run:
`#include <iostream>
using namespace std;

int main() {
  for (int i = 1; i <= 10; i++) {
    if (i == 4) continue;   // skip 4
    if (i == 7) break;      // stop at 7
    cout << i << " ";
  }
  cout << "\\n";

  char c = 'b';
  switch (c) {
    case 'a': cout << "Apple\\n"; break;
    case 'b': cout << "Banana\\n"; break;
    default:  cout << "Unknown\\n";
  }
  return 0;
}`,
              title: "break_switch.cpp",
            },
            { warn: "In a `switch`, forgetting `break` causes [[fall-through||Execution continues into the next case's statements. Sometimes intentional, but usually a bug — remember a `break` at the end of each case.]]." },
            {
              exercise: {
                title: "sum.cpp",
                prompt: "Write a loop that reads an integer `n` and prints the sum of all whole numbers from 1 to `n` (inclusive). For example, if `n` is 5 the answer is 1+2+3+4+5 = 15.",
                code:
`#include <iostream>
using namespace std;

int main() {
  int n;
  cin >> n;
  int sum = 0;
  // TODO: add 1 + 2 + ... + n into sum
  cout << sum;
  return 0;
}`,
                tests: [
                  { name: "sum to 5 = 15", stdin: "5", expected: "15" },
                  { name: "sum to 1 = 1", stdin: "1", expected: "1" },
                  { name: "sum to 10 = 55", stdin: "10", expected: "55" },
                  { name: "sum to 100 = 5050", stdin: "100", expected: "5050" },
                ],
                hint: "Use a `for` loop: `for (int i = 1; i <= n; i++) sum += i;`",
                solution:
`#include <iostream>
using namespace std;

int main() {
  int n;
  cin >> n;
  int sum = 0;
  for (int i = 1; i <= n; i++) sum += i;
  cout << sum;
  return 0;
}`,
              },
            },
            {
              quiz: {
                q: "Which loop guarantees its body runs at least once?",
                options: ["for", "while", "do-while", "range-based for"],
                answer: 2,
                explain: "do-while checks its condition after the body, so the body always executes at least one time.",
              },
            },
          ],
        },
      ],
    },

    /* ---------------------------------------------------------- */
    {
      title: "Functions",
      lessons: [
        {
          id: "functions1",
          eyebrow: "Module 5 · Functions",
          title: "Functions I — Reusable Blocks",
          lede: "A function is a named block of code that does one job. Define it once, call it anywhere.",
          blocks: [
            { p: "A function has a **return type**, a **name**, a list of **parameters**, and a **body**. Calling it runs the body with the arguments you supply." },
            {
              run:
`#include <iostream>
using namespace std;

int add(int a, int b) {   // returns an int
  return a + b;
}

int main() {
  int result = add(3, 4);
  cout << "3 + 4 = " << result << endl;
  return 0;
}`,
              title: "functions.cpp",
            },
            { h2: "void functions" },
            { p: "A function that performs an action but returns nothing uses the [[void||The \"no value\" type. A `void` function does its work — printing, modifying — without producing a result you can store.]] return type." },
            { code:
`#include <iostream>
#include <string>
using namespace std;

void greet(const string& name) {
  cout << "Hello, " << name << "!\\n";
}

int main() {
  greet("Ada");
  return 0;
}`,
              title: "void.cpp" },
            { h2: "Pass by value vs by reference" },
            { p: "By default arguments are **copied** (pass by value) — the original is untouched. Add `&` to pass by [[reference||A reference is an alias for the caller's variable. Changes inside the function affect the original. It also avoids copying large objects, which is faster.]] so the function can modify the caller's variable." },
            {
              run:
`#include <iostream>
using namespace std;

void addOneCopy(int x)  { x += 1; }     // local copy
void addOneRef(int& x)  { x += 1; }     // the real thing

int main() {
  int n = 10;
  addOneCopy(n);  cout << n << "\\n";   // still 10
  addOneRef(n);   cout << n << "\\n";   // now 11
  return 0;
}`,
              title: "by_reference.cpp",
            },
            { tip: "Pass large objects (strings, vectors) as `const T&` to avoid copying them while promising not to change them." },
            {
              exercise: {
                title: "square.cpp",
                prompt: "Your turn. Complete the function `square` so it returns its argument multiplied by itself. The program reads one integer from input and prints `square(n)`. Click **✓ Run tests** to check it against several hidden cases.",
                code:
`#include <iostream>
using namespace std;

int square(int n) {
  // TODO: return n times itself
  return 0;
}

int main() {
  int x;
  cin >> x;
  cout << square(x);
  return 0;
}`,
                tests: [
                  { name: "square(5) = 25", stdin: "5", expected: "25" },
                  { name: "square(0) = 0", stdin: "0", expected: "0" },
                  { name: "negatives: square(-3) = 9", stdin: "-3", expected: "9" },
                  { name: "square(12) = 144", stdin: "12", expected: "144" },
                ],
                hint: "Any number times itself is its square: `return n * n;`",
                solution:
`#include <iostream>
using namespace std;

int square(int n) {
  return n * n;
}

int main() {
  int x;
  cin >> x;
  cout << square(x);
  return 0;
}`,
              },
            },
            {
              quiz: {
                q: "What does void mean as a function's return type?",
                options: ["It returns zero", "It returns nothing", "It returns any type", "It cannot be called"],
                answer: 1,
                explain: "void signals the function produces no return value — it just performs an action.",
              },
            },
          ],
        },
        {
          id: "functions2",
          eyebrow: "Module 5 · Functions",
          title: "Functions II — Overloading, Defaults & Recursion",
          lede: "Give one name several meanings, supply default arguments, and let a function call itself.",
          blocks: [
            { h2: "Overloading" },
            { p: "[[Overloading||Defining multiple functions with the same name but different parameter lists. The compiler picks the right one based on the arguments you pass.]] lets the same name work for different argument types." },
            {
              run:
`#include <iostream>
using namespace std;

int    square(int x)    { return x * x; }
double square(double x) { return x * x; }

int main() {
  cout << square(5)    << "\\n";   // calls the int version
  cout << square(2.5)  << "\\n";   // calls the double version
  return 0;
}`,
              title: "overload.cpp",
            },
            { h2: "Default arguments" },
            { p: "Give a parameter a default value and callers may omit it." },
            {
              run:
`#include <iostream>
using namespace std;

int power(int base, int exp = 2) {  // exp defaults to 2
  int r = 1;
  for (int i = 0; i < exp; i++) r *= base;
  return r;
}

int main() {
  cout << power(5) << "\\n";     // 5^2 = 25
  cout << power(5, 3) << "\\n";  // 5^3 = 125
  return 0;
}`,
              title: "defaults.cpp",
            },
            { h2: "Recursion" },
            { p: "A [[recursive||A function that calls itself. Each call must move toward a *base case* that stops the recursion, or it will loop forever and crash.]] function calls itself to solve smaller versions of a problem." },
            {
              run:
`#include <iostream>
using namespace std;

int factorial(int n) {
  if (n <= 1) return 1;        // base case
  return n * factorial(n - 1); // recursive step
}

int main() {
  cout << "5! = " << factorial(5) << endl;  // 120
  return 0;
}`,
              title: "recursion.cpp",
            },
            { warn: "Every recursive function needs a **base case** that doesn't recurse. Without it you get infinite recursion and a stack overflow crash." },
            {
              quiz: {
                q: "What makes two overloaded functions distinct?",
                options: ["Their return types", "Their parameter lists", "Their names", "Their line numbers"],
                answer: 1,
                explain: "Overloads must differ in the number or types of parameters. Return type alone is not enough to distinguish them.",
              },
            },
          ],
        },
      ],
    },

    /* ---------------------------------------------------------- */
    {
      title: "Arrays & Strings",
      lessons: [
        {
          id: "arrays",
          eyebrow: "Module 6 · Compound types",
          title: "Arrays",
          lede: "An array stores many values of the same type under one name, accessed by index.",
          blocks: [
            { p: "Declare an array with a type, a name, and a size. Access elements with `[]` — indices start at **0**." },
            {
              run:
`#include <iostream>
using namespace std;

int main() {
  int scores[5] = {90, 85, 77, 60, 100};
  cout << "First: " << scores[0] << "\\n";
  cout << "Last:  " << scores[4] << "\\n";

  int total = 0;
  for (int i = 0; i < 5; i++) total += scores[i];
  cout << "Average: " << total / 5 << endl;
  return 0;
}`,
              title: "arrays.cpp",
            },
            { danger: "C++ does **not** check array bounds. `scores[5]` or `scores[99]` reads invalid memory — [[undefined behaviour||The standard places no requirement on what happens. The program may crash, print garbage, or appear to work and fail later. Always stay within `[0, size-1]`.]]. Stay within the valid range yourself." },
            { h2: "Multidimensional arrays" },
            { p: "Arrays can have more than one dimension — useful for grids and tables." },
            {
              run:
`#include <iostream>
using namespace std;

int main() {
  int grid[2][3] = {{1, 2, 3}, {4, 5, 6}};
  for (int r = 0; r < 2; r++) {
    for (int c = 0; c < 3; c++) cout << grid[r][c] << " ";
    cout << "\\n";
  }
  return 0;
}`,
              title: "grid.cpp",
            },
            { h2: "Prefer std::vector" },
            { p: "Raw arrays have a fixed size. The standard library's [[vector||A dynamic array from `<vector>`. It grows and shrinks at runtime, knows its own `.size()`, and manages its own memory. Prefer it over raw arrays in modern C++.]] is a safer, resizable array — you'll use it constantly." },
            {
              run:
`#include <iostream>
#include <vector>
using namespace std;

int main() {
  vector<int> v = {10, 20, 30};
  v.push_back(40);            // grows automatically
  for (int x : v) cout << x << " ";
  cout << "\\n(size = " << v.size() << ")" << endl;
  return 0;
}`,
              title: "vector.cpp",
            },
            {
              exercise: {
                title: "max.cpp",
                prompt: "Read an integer `n`, then `n` more integers, and print the **largest** of them. Input arrives as `n` followed by the values (separated by spaces or newlines).",
                code:
`#include <iostream>
using namespace std;

int main() {
  int n;
  cin >> n;
  int best;
  // TODO: read n numbers and keep track of the maximum
  cout << best;
  return 0;
}`,
                tests: [
                  { name: "max of {4, 9, 2} = 9", stdin: "3\n4 9 2", expected: "9" },
                  { name: "single value", stdin: "1\n7", expected: "7" },
                  { name: "negatives", stdin: "4\n-5 -2 -9 -1", expected: "-1" },
                  { name: "max at the end", stdin: "5\n3 1 4 1 5", expected: "5" },
                ],
                hint: "Read the first value as your current best, then for each remaining value, update best with `if (v > best) best = v;`.",
                solution:
`#include <iostream>
using namespace std;

int main() {
  int n;
  cin >> n;
  int best;
  for (int i = 0; i < n; i++) {
    int v;
    cin >> v;
    if (i == 0 || v > best) best = v;
  }
  cout << best;
  return 0;
}`,
              },
            },
            {
              quiz: {
                q: "What is the index of the first element of an array in C++?",
                options: ["1", "0", "-1", "Depends on the type"],
                answer: 1,
                explain: "C++ arrays are zero-indexed: the first element is arr[0] and the last is arr[size - 1].",
              },
            },
          ],
        },
        {
          id: "strings",
          eyebrow: "Module 6 · Compound types",
          title: "Character Sequences & Strings",
          lede: "Text is a sequence of characters. Modern C++ gives you the friendly std::string.",
          blocks: [
            { p: "A `char` holds one character. Historically, text was a [[C-string||An array of `char` ending with a hidden null character `'\\0'`. Error-prone to manage by hand. `std::string` wraps all of this for you.]] — an array of chars. Today, use `std::string`." },
            {
              run:
`#include <iostream>
#include <string>
using namespace std;

int main() {
  string a = "Hello";
  string b = "World";
  string c = a + ", " + b + "!";   // concatenation
  cout << c << "\\n";
  cout << "Length: " << c.length() << "\\n";
  cout << "First char: " << c[0] << endl;
  return 0;
}`,
              title: "strings.cpp",
            },
            { h2: "Useful string operations" },
            { ul: [
              "`s.length()` or `s.size()` — number of characters",
              "`s + t` — join two strings",
              "`s[i]` — the character at index `i`",
              "`s.substr(pos, len)` — a piece of the string",
              "`s.find(\"x\")` — locate text (returns `string::npos` if absent)",
            ]},
            {
              run:
`#include <iostream>
#include <string>
using namespace std;

int main() {
  string email = "ada@example.com";
  int at = email.find('@');
  cout << "User: "   << email.substr(0, at) << "\\n";
  cout << "Domain: " << email.substr(at + 1) << endl;
  return 0;
}`,
              title: "substr.cpp",
            },
            { tip: "Iterate a string just like an array: `for (char ch : s) { ... }` visits every character." },
            {
              quiz: {
                q: "Which header must you include to use std::string?",
                options: ["<iostream>", "<string>", "<cstring>", "<text>"],
                answer: 1,
                explain: "std::string lives in <string>. (<cstring> is for old C-style char* functions.)",
              },
            },
          ],
        },
      ],
    },

    /* ---------------------------------------------------------- */
    {
      title: "Pointers & Memory",
      lessons: [
        {
          id: "pointers",
          eyebrow: "Module 7 · Memory",
          title: "Pointers",
          lede: "A pointer stores a memory address. It's the feature that gives C++ its power — and its sharp edges.",
          blocks: [
            { p: "Every variable lives at an [[address||A numeric location in memory, like a house number. The `&` operator gives you the address of a variable.]]. A **pointer** is a variable that stores such an address." },
            { ul: [
              "`&x` — the **address-of** operator: where `x` lives.",
              "`int* p` — declares `p` as a pointer to an `int`.",
              "`*p` — the **dereference** operator: the value `p` points at.",
            ]},
            {
              run:
`#include <iostream>
using namespace std;

int main() {
  int x = 42;
  int* p = &x;        // p holds the address of x

  cout << "x  = " << x  << "\\n";
  cout << "*p = " << *p << "\\n";   // read through the pointer

  *p = 100;           // write through the pointer
  cout << "x  = " << x << endl;     // x is now 100
  return 0;
}`,
              title: "pointers.cpp",
            },
            { p: "`*p = 100` changes `x` because `p` points at `x`. The pointer and the variable share the same memory." },
            { diagram: "pointers", caption: "`p` stores the **address** of `x`. Following the arrow with `*p` reaches `x`'s value — change one and you change the other." },
            { h2: "Pointers and arrays" },
            { p: "An array name decays to a pointer to its first element, which is why pointer arithmetic walks through arrays." },
            {
              run:
`#include <iostream>
using namespace std;

int main() {
  int nums[3] = {10, 20, 30};
  int* p = nums;          // points to nums[0]
  cout << *p << " " << *(p + 1) << " " << *(p + 2) << endl;
  return 0;
}`,
              title: "ptr_array.cpp",
            },
            { h2: "The null pointer" },
            { p: "A pointer that points to nothing should be set to [[nullptr||The modern, type-safe \"points to nothing\" value. Dereferencing it crashes immediately — which is far better than silently corrupting memory. Always initialise pointers, to a real address or to nullptr.]]." },
            { danger: "Dereferencing an uninitialised or null pointer is undefined behaviour and usually crashes. Always make a pointer point somewhere valid before using `*`." },
            {
              quiz: {
                q: "If int* p = &x; what does *p give you?",
                options: ["The address of x", "The value stored in x", "A copy of the pointer", "The size of x"],
                answer: 1,
                explain: "& takes an address; * (dereference) follows the pointer back to the value — here, the contents of x.",
              },
            },
          ],
        },
        {
          id: "dynamic",
          eyebrow: "Module 7 · Memory",
          title: "Dynamic Memory",
          lede: "Ask the operating system for memory at runtime with new, and give it back with delete.",
          blocks: [
            { p: "Sometimes you don't know how much memory you need until the program runs. `new` allocates memory on the [[heap||A large pool of memory for data whose lifetime you control manually, as opposed to the *stack* which holds local variables automatically. Heap memory lives until you `delete` it.]] and returns a pointer to it." },
            {
              run:
`#include <iostream>
using namespace std;

int main() {
  int* p = new int;     // allocate one int
  *p = 7;
  cout << *p << "\\n";
  delete p;             // give it back

  int n = 4;
  int* arr = new int[n];      // allocate an array
  for (int i = 0; i < n; i++) arr[i] = i * i;
  for (int i = 0; i < n; i++) cout << arr[i] << " ";
  cout << "\\n";
  delete[] arr;               // note the [] for arrays
  return 0;
}`,
              title: "dynamic.cpp",
            },
            { danger: "Every `new` needs exactly one matching `delete` (and `new[]` needs `delete[]`). Forgetting causes a [[memory leak||Memory you allocated but never released. The program holds it until it exits, slowly consuming RAM. In long-running programs this is a serious bug.]]; deleting twice is undefined behaviour." },
            { diagram: "memory", caption: "Local variables live on the **stack** (cleaned up automatically). `new` carves memory from the **heap**, which lives until you `delete[]` it." },
            { h2: "The modern alternative: smart pointers" },
            { p: "Manual `new`/`delete` is easy to get wrong. Modern C++ prefers [[smart pointers||Objects from `<memory>` that own a pointer and `delete` it automatically when they go out of scope. `unique_ptr` for sole ownership, `shared_ptr` for shared ownership.]] that free memory automatically." },
            {
              run:
`#include <iostream>
#include <memory>
using namespace std;

int main() {
  unique_ptr<int> p(new int(99));  // C++11-compatible ownership
  cout << *p << endl;
  // no delete needed — freed automatically when p goes out of scope
  return 0;
}`,
              title: "smart_ptr.cpp",
            },
            { tip: "Rule of thumb for modern code: reach for `std::vector` and smart pointers first. Raw `new`/`delete` is rarely needed in everyday programs. In C++14 and later, prefer `make_unique<int>(99)` over writing `new` directly." },
            {
              quiz: {
                q: "Which statement correctly frees memory allocated with new int[10]?",
                options: ["delete p;", "delete[] p;", "free(p);", "p = nullptr;"],
                answer: 1,
                explain: "Array allocations from new[] must be released with delete[]. Using plain delete on an array is undefined behaviour.",
              },
            },
          ],
        },
      ],
    },

    /* ---------------------------------------------------------- */
    {
      title: "Data Structures",
      lessons: [
        {
          id: "structures",
          eyebrow: "Module 8 · Aggregates",
          title: "Data Structures (struct)",
          lede: "Bundle related variables into one type that models a real-world thing.",
          blocks: [
            { p: "A `struct` groups several values — its [[members||The named variables that live inside a struct or class. You reach them with the dot operator: `point.x`.]] — into a single named type." },
            {
              run:
`#include <iostream>
#include <string>
using namespace std;

struct Person {
  string name;
  int    age;
};

int main() {
  Person p;
  p.name = "Grace";
  p.age  = 36;
  cout << p.name << " is " << p.age << endl;

  Person q = {"Alan", 41};   // brace initialisation
  cout << q.name << " is " << q.age << endl;
  return 0;
}`,
              title: "struct.cpp",
            },
            { p: "Use the **dot** operator `.` to read or set a member. If you only have a pointer to a struct, use the [[arrow||`ptr->member` is shorthand for `(*ptr).member` — dereference the pointer, then access the member. Universally used with pointers to objects.]] operator `->`." },
            {
              run:
`#include <iostream>
#include <string>
using namespace std;

struct Book { string title; int pages; };

int main() {
  Book b = {"C++", 144};
  Book* ptr = &b;
  cout << ptr->title << " has " << ptr->pages << " pages" << endl;
  return 0;
}`,
              title: "arrow.cpp",
            },
            { tip: "An array of structs models a table neatly: `Person people[100];` is a list of 100 people, each with a name and age." },
            {
              quiz: {
                q: "Given Book* ptr, how do you access its title member?",
                options: ["ptr.title", "ptr->title", "*ptr.title", "ptr::title"],
                answer: 1,
                explain: "With a pointer you use ->. The dot operator is for an object directly; -> dereferences first.",
              },
            },
          ],
        },
        {
          id: "othertypes",
          eyebrow: "Module 8 · Aggregates",
          title: "Other Data Types",
          lede: "Type aliases, enumerations, and unions round out your modelling toolkit.",
          blocks: [
            { h2: "Type aliases" },
            { p: "Give an existing type a new name with `using` (modern) or `typedef` (classic). Handy for long type names." },
            { code:
`using Distance = double;     // modern
typedef double Distance2;    // classic, same effect`,
              title: "alias.cpp" },
            { h2: "Enumerations" },
            { p: "An [[enum||An enumeration: a type with a fixed set of named values. Prefer `enum class` for stronger typing and to avoid name clashes.]] defines a type whose values are a named list — clearer than magic numbers." },
            {
              run:
`#include <iostream>
using namespace std;

enum class Color { Red, Green, Blue };

int main() {
  Color c = Color::Green;
  if (c == Color::Green) cout << "Go!" << endl;
  return 0;
}`,
              title: "enum.cpp",
            },
            { h2: "Unions" },
            { p: "A [[union||A type where all members share the same memory, so only one is valid at a time. Saves space but you must track which member is active. Rarely needed in everyday code.]] stores one of several members in the same memory. It's a niche, space-saving tool." },
            { tip: "Reach for `enum class` whenever a variable should only hold one of a small set of named options — days of the week, game states, directions." },
            {
              quiz: {
                q: "Why use an enum class instead of plain int constants?",
                options: ["It runs faster", "It gives meaningful names and type safety", "It uses less memory always", "It is required by the compiler"],
                answer: 1,
                explain: "Enums make code self-documenting and let the compiler catch invalid values — far safer than scattering raw integers.",
              },
            },
          ],
        },
      ],
    },

    /* ---------------------------------------------------------- */
    {
      title: "Classes & Objects",
      lessons: [
        {
          id: "classes1",
          eyebrow: "Module 9 · OOP",
          title: "Classes I — Data + Behaviour",
          lede: "A class bundles data with the functions that act on it. This is the heart of object-oriented C++.",
          blocks: [
            { p: "A `class` is like a `struct` but adds [[member functions||Functions that belong to the class and operate on its data. Also called *methods*. They can read and modify the object's members.]] and **access control**. An [[object||A concrete instance of a class. The class is the blueprint; objects are the houses built from it.]] is one instance of a class." },
            {
              run:
`#include <iostream>
using namespace std;

class Counter {
public:               // accessible from outside
  int value = 0;
  void increment() { value++; }
  void reset()     { value = 0; }
};

int main() {
  Counter c;
  c.increment();
  c.increment();
  cout << "Count: " << c.value << endl;   // 2
  return 0;
}`,
              title: "class.cpp",
            },
            { h2: "Encapsulation: public vs private" },
            { p: "[[private||Members marked private can only be touched by the class's own functions. This *encapsulation* protects data from accidental misuse and lets you change internals later without breaking users.]] members are hidden; `public` members form the interface. Hide the data, expose safe methods." },
            {
              run:
`#include <iostream>
using namespace std;

class BankAccount {
private:
  double balance = 0;          // protected from outside
public:
  void deposit(double amount) {
    if (amount > 0) balance += amount;
  }
  double getBalance() const { return balance; }
};

int main() {
  BankAccount acc;
  acc.deposit(100);
  acc.deposit(-50);            // rejected by the method
  cout << "Balance: " << acc.getBalance() << endl;  // 100
  return 0;
}`,
              title: "encapsulation.cpp",
            },
            { p: "The `const` after `getBalance()` promises the method won't modify the object — a useful guarantee." },
            { tip: "Convention: keep data members `private` and provide `public` methods to access them. This is encapsulation, the first pillar of OOP." },
            {
              quiz: {
                q: "What does marking a data member private achieve?",
                options: ["Makes it faster", "Hides it so only the class's own methods can access it", "Makes it constant", "Shares it across all objects"],
                answer: 1,
                explain: "private enforces encapsulation: outside code must go through the class's public methods, which can validate and protect the data.",
              },
            },
          ],
        },
        {
          id: "classes2",
          eyebrow: "Module 9 · OOP",
          title: "Classes II — Constructors & More",
          lede: "Initialise objects automatically with constructors, and clean up with destructors.",
          blocks: [
            { p: "A [[constructor||A special method with the same name as the class and no return type. It runs automatically when an object is created, setting up its initial state.]] runs when an object is born. It often takes parameters to set initial values." },
            {
              run:
`#include <iostream>
#include <string>
using namespace std;

class Point {
public:
  int x, y;
  Point(int a, int b) : x(a), y(b) {}   // constructor
  void print() const { cout << "(" << x << ", " << y << ")\\n"; }
};

int main() {
  Point p(3, 4);
  p.print();
  return 0;
}`,
              title: "constructor.cpp",
            },
            { p: "The `: x(a), y(b)` part is an [[initialiser list||The preferred way to set members in a constructor. It initialises them directly, which is more efficient than assigning inside the body and is required for const/reference members.]]." },
            { h2: "Destructors" },
            { p: "A [[destructor||`~ClassName()` runs automatically when an object is destroyed — when it goes out of scope or is deleted. The place to release resources the object owned, like memory or files.]] runs at an object's end of life, used to release resources." },
            {
              run:
`#include <iostream>
using namespace std;

class Greeter {
public:
  Greeter()  { cout << "Hello!\\n"; }   // constructor
  ~Greeter() { cout << "Goodbye!\\n"; } // destructor
};

int main() {
  cout << "start\\n";
  { Greeter g; }   // g created then destroyed here
  cout << "end\\n";
  return 0;
}`,
              title: "destructor.cpp",
            },
            { h2: "static members" },
            { p: "A [[static||A static member belongs to the *class itself*, not to any single object. All objects share one copy — useful for counters or shared configuration.]] member is shared by every object of the class." },
            { tip: "C++'s big idea — RAII — ties resource lifetime to object lifetime: acquire in the constructor, release in the destructor, and cleanup becomes automatic." },
            {
              quiz: {
                q: "When does a destructor run?",
                options: ["When the object is created", "When the object is destroyed or goes out of scope", "Only when you call it by name", "Never, automatically"],
                answer: 1,
                explain: "Destructors fire automatically at the end of an object's life — perfect for releasing resources it held.",
              },
            },
          ],
        },
      ],
    },

    /* ---------------------------------------------------------- */
    {
      title: "Inheritance & Polymorphism",
      lessons: [
        {
          id: "inheritance",
          eyebrow: "Module 10 · OOP",
          title: "Inheritance",
          lede: "Build new classes on top of existing ones, reusing and extending their behaviour.",
          blocks: [
            { p: "[[Inheritance||A derived (child) class automatically gains the members of its base (parent) class, then adds or customises behaviour. Models an \"is-a\" relationship: a Dog *is an* Animal.]] lets a class build on another. The child reuses the parent's code and adds its own." },
            {
              run:
`#include <iostream>
#include <string>
using namespace std;

class Animal {
public:
  string name;
  Animal(string n) : name(n) {}
  void breathe() const { cout << name << " breathes\\n"; }
};

class Dog : public Animal {   // Dog inherits from Animal
public:
  Dog(string n) : Animal(n) {}
  void bark() const { cout << name << " says Woof!\\n"; }
};

int main() {
  Dog d("Rex");
  d.breathe();   // inherited from Animal
  d.bark();      // Dog's own method
  return 0;
}`,
              title: "inheritance.cpp",
            },
            { p: "`Dog : public Animal` means a `Dog` *is an* `Animal` and gains all its public members. The `: Animal(n)` call passes data up to the base constructor." },
            { diagram: "inheritance", caption: "Each derived class inherits the base's members (like `breathe()`) and adds its own. This models an *is-a* relationship." },
            { h2: "Friendship" },
            { p: "A [[friend||A function or class granted access to another class's private members. Use sparingly — it deliberately breaks encapsulation for cases like operator overloading.]] declaration grants another function or class access to private members." },
            { tip: "Favour composition (an object *has-a* another object) over deep inheritance hierarchies. Inheritance is powerful but easy to overuse." },
            {
              quiz: {
                q: "In class Dog : public Animal, what does Dog gain?",
                options: ["Nothing automatically", "Animal's public (and protected) members", "Only Animal's private members", "A copy of every Animal object"],
                answer: 1,
                explain: "A derived class inherits the base class's public and protected members, which it can use and extend.",
              },
            },
          ],
        },
        {
          id: "polymorphism",
          eyebrow: "Module 10 · OOP",
          title: "Polymorphism",
          lede: "One interface, many forms. Call the same method and get behaviour specific to each object's real type.",
          blocks: [
            { p: "Mark a method [[virtual||A virtual function can be overridden by derived classes. When called through a base pointer/reference, C++ runs the *derived* version — this is runtime polymorphism.]] and derived classes can override it. A base-class pointer then calls the *correct* version at runtime." },
            {
              run:
`#include <iostream>
using namespace std;

class Shape {
public:
  virtual double area() const { return 0; }
  virtual ~Shape() {}            // virtual destructor
};

class Circle : public Shape {
  double r;
public:
  Circle(double radius) : r(radius) {}
  double area() const override { return 3.14159 * r * r; }
};

class Square : public Shape {
  double s;
public:
  Square(double side) : s(side) {}
  double area() const override { return s * s; }
};

int main() {
  Shape* shapes[] = { new Circle(2), new Square(3) };
  for (Shape* sh : shapes) {
    cout << "Area: " << sh->area() << "\\n";  // calls the right one
    delete sh;
  }
  return 0;
}`,
              title: "polymorphism.cpp",
            },
            { p: "Even though we loop over `Shape*`, each call to `area()` runs the `Circle` or `Square` version. That dynamic dispatch is polymorphism." },
            { diagram: "dispatch", caption: "One `Shape*` interface, many implementations. At runtime, `s->area()` dispatches to the *actual* object's overridden method." },
            { h2: "Abstract classes" },
            { p: "A [[pure virtual||Written `virtual double area() const = 0;`. It has no body, so the class becomes *abstract* and cannot be instantiated — derived classes must provide an implementation. Defines an interface.]] function (`= 0`) makes a class abstract — a contract that derived classes must fulfil." },
            { warn: "If a class has virtual functions and you ever delete objects through a base pointer, give it a **virtual destructor** — otherwise cleanup is incomplete." },
            {
              quiz: {
                q: "What does the virtual keyword enable?",
                options: ["Faster function calls", "Calling the derived version through a base pointer", "Private inheritance", "Compile-time type checks"],
                answer: 1,
                explain: "virtual enables runtime polymorphism: the actual object's overriding method is called, even via a base-class pointer or reference.",
              },
            },
          ],
        },
      ],
    },

    /* ---------------------------------------------------------- */
    {
      title: "Advanced Concepts",
      lessons: [
        {
          id: "templates",
          eyebrow: "Module 11 · Generics",
          title: "Templates",
          lede: "Write code once that works for any type. Templates power the entire standard library.",
          blocks: [
            { p: "A [[template||A blueprint for generating functions or classes that work with any type. The compiler stamps out a concrete version for each type you use — `max<int>`, `max<double>`, and so on.]] lets you parameterise code by type, avoiding copy-pasted overloads." },
            {
              run:
`#include <iostream>
using namespace std;

template <typename T>
T maximum(T a, T b) {
  return (a > b) ? a : b;
}

int main() {
  cout << maximum(3, 7) << "\\n";          // int
  cout << maximum(2.5, 1.5) << "\\n";      // double
  cout << maximum('a', 'z') << "\\n";      // char
  return 0;
}`,
              title: "template_fn.cpp",
            },
            { p: "The compiler generates a separate `maximum` for each type you call it with — `int`, `double`, `char` — all from one definition." },
            { h2: "Class templates" },
            { p: "Whole classes can be templated. `std::vector<int>` and `std::vector<string>` are the same template with different type arguments." },
            {
              run:
`#include <iostream>
using namespace std;

template <typename T>
class Box {
  T value;
public:
  Box(T v) : value(v) {}
  T get() const { return value; }
};

int main() {
  Box<int> bi(42);
  Box<string> bs("hi");
  cout << bi.get() << " " << bs.get() << endl;
  return 0;
}`,
              title: "template_class.cpp",
            },
            { tip: "The entire Standard Template Library (STL) — vector, map, sort, and friends — is built from templates. Learning templates unlocks all of it." },
            {
              quiz: {
                q: "What problem do templates primarily solve?",
                options: ["Memory leaks", "Writing the same logic once for many types", "Faster compilation", "Network communication"],
                answer: 1,
                explain: "Templates let you write generic code once and have the compiler specialise it for each type — no duplication.",
              },
            },
          ],
        },
        {
          id: "namespaces",
          eyebrow: "Module 11 · Organisation",
          title: "Namespaces",
          lede: "Group related names and prevent clashes between libraries.",
          blocks: [
            { p: "A [[namespace||A named scope that groups related identifiers. It prevents collisions: two libraries can both define `print` if each lives in its own namespace.]] is a labelled region that keeps names from colliding. The standard library lives in `std`." },
            {
              run:
`#include <iostream>
using namespace std;

namespace math {
  const double PI = 3.14159;
  double square(double x) { return x * x; }
}

int main() {
  cout << math::PI << "\\n";
  cout << math::square(5) << endl;
  return 0;
}`,
              title: "namespace.cpp",
            },
            { p: "Access members with the [[scope operator||The `::` operator reaches into a namespace or class. `std::cout`, `math::PI`. It tells the compiler exactly which name you mean.]] `::`, e.g. `math::PI`. `using namespace math;` would let you drop the prefix." },
            { tip: "`using namespace std;` is convenient in small programs and tutorials, but in large codebases prefer writing `std::` explicitly to keep it clear where names come from." },
            {
              quiz: {
                q: "Why do namespaces exist?",
                options: ["To speed up code", "To prevent name collisions and organise code", "To allocate memory", "To define classes"],
                answer: 1,
                explain: "Namespaces partition the global name space so different libraries can use the same identifier without conflict.",
              },
            },
          ],
        },
        {
          id: "exceptions",
          eyebrow: "Module 11 · Robustness",
          title: "Exceptions",
          lede: "Handle errors gracefully by throwing and catching exceptions instead of crashing.",
          blocks: [
            { p: "When something goes wrong, [[throw||Raises an exception, immediately abandoning the current path. Control jumps to the nearest matching `catch` block, unwinding the stack and running destructors along the way.]] an exception. Code that might fail goes in a `try` block; a `catch` block handles the problem." },
            {
              run:
`#include <iostream>
#include <stdexcept>
using namespace std;

double divide(double a, double b) {
  if (b == 0) throw runtime_error("division by zero");
  return a / b;
}

int main() {
  try {
    cout << divide(10, 2) << "\\n";
    cout << divide(10, 0) << "\\n";   // throws
    cout << "this line is skipped\\n";
  } catch (const runtime_error& e) {
    cout << "Error: " << e.what() << endl;
  }
  cout << "program continues\\n";
  return 0;
}`,
              title: "exceptions.cpp",
            },
            { p: "When `divide(10, 0)` throws, execution jumps straight to the `catch` block — the lines in between are skipped, but the program survives." },
            { warn: "Catch exceptions by `const` reference (`const std::exception& e`) to avoid slicing and unnecessary copies. `e.what()` returns the error message." },
            {
              quiz: {
                q: "After an exception is thrown, where does execution go?",
                options: ["To the end of main", "To the nearest matching catch block", "Back to the start of the try", "It always terminates the program"],
                answer: 1,
                explain: "Throwing unwinds the stack until it finds a catch that matches the exception type; the program continues from there.",
              },
            },
          ],
        },
        {
          id: "typecasting",
          eyebrow: "Module 11 · Conversions",
          title: "Type Casting",
          lede: "Convert a value from one type to another — safely and explicitly.",
          blocks: [
            { p: "C++ converts some types automatically (`int` to `double`). When you need to force a conversion, use a named cast — they're clearer and safer than C-style casts." },
            {
              run:
`#include <iostream>
using namespace std;

int main() {
  int a = 7, b = 2;
  double exact = static_cast<double>(a) / b;  // forces real division
  cout << "7 / 2 = " << exact << endl;        // 3.5, not 3
  return 0;
}`,
              title: "cast.cpp",
            },
            { h2: "The named casts" },
            { ul: [
              "[[static_cast||The everyday cast for related types such as numeric conversions. It is checked at compile time, but it does not perform a runtime safety check for downcasts in a class hierarchy.]] `static_cast<T>(v)` — ordinary, compile-time conversions.",
              "[[dynamic_cast||Safely converts pointers/references within a polymorphic class hierarchy, checking at runtime. For pointers it returns `nullptr` if the conversion is not valid; for references it throws `std::bad_cast`.]] `dynamic_cast<T>(v)` — runtime-checked downcasts in class hierarchies.",
              "`const_cast` — adds or removes `const` (use rarely).",
              "`reinterpret_cast` — low-level bit reinterpretation (dangerous).",
            ]},
            { tip: "Reach for `static_cast` 99% of the time. Avoid the old C-style `(double)x` syntax — named casts say exactly what you intend and are easier to search for." },
            {
              quiz: {
                q: "Why write static_cast<double>(a) / b instead of a / b?",
                options: ["It's faster", "To force floating-point division and keep the decimals", "To save memory", "It rounds the result"],
                answer: 1,
                explain: "If both a and b are int, a / b does integer division. Casting one operand to double makes the whole expression floating-point.",
              },
            },
          ],
        },
      ],
    },

    /* ---------------------------------------------------------- */
    {
      title: "Capstone Project",
      lessons: [
        {
          id: "capstone1",
          eyebrow: "Capstone · Step 1",
          title: "Build a To-Do List — Modelling a Task",
          lede: "Time to put it together. Over three graded steps you'll build a small command-line to-do list, with hidden tests checking each stage.",
          blocks: [
            { p: "A to-do item has two pieces of state: a **title** and whether it's **done**. A `struct` models that perfectly. We'll also need a way to display one." },
            { p: "Below, the `Task` struct and `main` are written for you. Your job is to finish `printTask` so it prints `[x] title` for a completed task and `[ ] title` for an unfinished one, each on its own line." },
            {
              exercise: {
                title: "todo_step1.cpp",
                prompt: "Complete `printTask`. It should print `[x] ` then the title when `t.done` is true, or `[ ] ` then the title otherwise — followed by a newline.",
                code:
`#include <iostream>
#include <string>
using namespace std;

struct Task {
  string title;
  bool done;
};

void printTask(const Task& t) {
  // TODO: print "[x] " + title if done, else "[ ] " + title, then a newline
}

int main() {
  Task a{"Buy milk", false};
  Task b{"Write code", true};
  printTask(a);
  printTask(b);
  return 0;
}`,
                tests: [
                  { name: "renders done & not-done", stdin: "", expected: "[ ] Buy milk\n[x] Write code" },
                ],
                hint: "A ternary keeps it tidy: `cout << (t.done ? \"[x] \" : \"[ ] \") << t.title << endl;`",
                solution:
`#include <iostream>
#include <string>
using namespace std;

struct Task {
  string title;
  bool done;
};

void printTask(const Task& t) {
  cout << (t.done ? "[x] " : "[ ] ") << t.title << endl;
}

int main() {
  Task a{"Buy milk", false};
  Task b{"Write code", true};
  printTask(a);
  printTask(b);
  return 0;
}`,
              },
            },
            { tip: "`Task a{\"Buy milk\", false};` is brace initialisation — it fills the members in order. You met it back in the Data Structures module." },
          ],
        },
        {
          id: "capstone2",
          eyebrow: "Capstone · Step 2",
          title: "A List of Tasks",
          lede: "One task is nice; a real to-do app holds many. Store them in a vector and add to it.",
          blocks: [
            { p: "Implement `addTask` so it appends a new, **not-yet-done** task with the given title to the vector. `printTask` is already provided." },
            {
              exercise: {
                title: "todo_step2.cpp",
                prompt: "Complete `addTask(list, title)` so it adds a new `Task` (with `done` = false) to the end of `list`.",
                code:
`#include <iostream>
#include <string>
#include <vector>
using namespace std;

struct Task { string title; bool done; };

void printTask(const Task& t) {
  cout << (t.done ? "[x] " : "[ ] ") << t.title << endl;
}

void addTask(vector<Task>& list, const string& title) {
  // TODO: append a new Task{title, false} to list
}

int main() {
  vector<Task> list;
  addTask(list, "Buy milk");
  addTask(list, "Write code");
  addTask(list, "Sleep");
  cout << "You have " << list.size() << " tasks:" << endl;
  for (const Task& t : list) printTask(t);
  return 0;
}`,
                tests: [
                  { name: "adds three tasks", stdin: "", expected: "You have 3 tasks:\n[ ] Buy milk\n[ ] Write code\n[ ] Sleep" },
                ],
                hint: "`std::vector` grows with `push_back`: `list.push_back(Task{title, false});`",
                solution:
`#include <iostream>
#include <string>
#include <vector>
using namespace std;

struct Task { string title; bool done; };

void printTask(const Task& t) {
  cout << (t.done ? "[x] " : "[ ] ") << t.title << endl;
}

void addTask(vector<Task>& list, const string& title) {
  list.push_back(Task{title, false});
}

int main() {
  vector<Task> list;
  addTask(list, "Buy milk");
  addTask(list, "Write code");
  addTask(list, "Sleep");
  cout << "You have " << list.size() << " tasks:" << endl;
  for (const Task& t : list) printTask(t);
  return 0;
}`,
              },
            },
          ],
        },
        {
          id: "capstone3",
          eyebrow: "Capstone · Step 3",
          title: "The Interactive To-Do App",
          lede: "Bring it all together into a real program that reads commands and responds — the finished capstone.",
          blocks: [
            { p: "This program reads commands, one per line, until `quit`:" },
            { ul: [
              "`add <text>` — add a new task",
              "`done <n>` — mark task number `n` (1-based) as complete",
              "`list` — print every task",
              "`quit` — stop",
            ]},
            { p: "The command loop, `add`, and `quit` are written for you. Finish the two `TODO`s: handling `done <n>` and handling `list`. The hidden tests feed in a sequence of commands and check the output." },
            {
              exercise: {
                title: "todo_app.cpp",
                prompt: "Complete the `done` and `list` commands. For `done`, mark `list[n-1]` complete (the number is 1-based) — ignore out-of-range numbers. For `list`, print every task with `printTask`.",
                code:
`#include <iostream>
#include <string>
#include <vector>
using namespace std;

struct Task { string title; bool done; };

void printTask(const Task& t) {
  cout << (t.done ? "[x] " : "[ ] ") << t.title << endl;
}

int main() {
  vector<Task> list;
  string line;
  while (getline(cin, line)) {
    if (line == "quit") break;
    else if (line.rfind("add ", 0) == 0) {
      list.push_back(Task{line.substr(4), false});
    }
    else if (line.rfind("done ", 0) == 0) {
      int n = stoi(line.substr(5));
      // TODO: mark task number n (1-based) as done, if it exists
    }
    else if (line == "list") {
      // TODO: print every task using printTask
    }
  }
  return 0;
}`,
                tests: [
                  { name: "add, done, list", stdin: "add Buy milk\nadd Write code\ndone 2\nlist\nquit", expected: "[ ] Buy milk\n[x] Write code" },
                  { name: "multiple completes", stdin: "add A\nadd B\nadd C\ndone 1\ndone 3\nlist\nquit", expected: "[x] A\n[ ] B\n[x] C" },
                  { name: "ignores bad index", stdin: "add Only\ndone 9\nlist\nquit", expected: "[ ] Only" },
                ],
                hint: "For done: `if (n >= 1 && n <= (int)list.size()) list[n-1].done = true;` — note the `-1` because users count from 1. For list: a range-based for over `list` calling `printTask(t)`.",
                solution:
`#include <iostream>
#include <string>
#include <vector>
using namespace std;

struct Task { string title; bool done; };

void printTask(const Task& t) {
  cout << (t.done ? "[x] " : "[ ] ") << t.title << endl;
}

int main() {
  vector<Task> list;
  string line;
  while (getline(cin, line)) {
    if (line == "quit") break;
    else if (line.rfind("add ", 0) == 0) {
      list.push_back(Task{line.substr(4), false});
    }
    else if (line.rfind("done ", 0) == 0) {
      int n = stoi(line.substr(5));
      if (n >= 1 && n <= (int)list.size()) list[n - 1].done = true;
    }
    else if (line == "list") {
      for (const Task& t : list) printTask(t);
    }
  }
  return 0;
}`,
              },
            },
            { tip: "`line.rfind(\"add \", 0) == 0` is a common idiom for \"does this string start with…\". It searches for the prefix only at position 0." },
            { p: "**That's a complete, working program** — built entirely from the concepts in this course: structs, vectors, functions, references, loops, conditionals, and string handling. Mark it complete and take a victory lap. 🎉" },
          ],
        },
      ],
    },

    /* ---------------------------------------------------------- */
    {
      title: "Standard Library & Tooling",
      lessons: [
        {
          id: "preprocessor",
          eyebrow: "Module 12 · Build",
          title: "Preprocessor Directives",
          lede: "Lines starting with # are handled before compilation — includes, macros, and conditional code.",
          blocks: [
            { p: "The [[preprocessor||A text-processing step that runs before the real compiler. It handles `#include`, `#define`, and conditional `#if` blocks by transforming your source text.]] runs first and rewrites your source. The most common directive is `#include`." },
            { ul: [
              "`#include <iostream>` — pull in a standard library header.",
              "`#include \"myfile.h\"` — pull in one of your own headers.",
              "`#define NAME value` — define a macro (text replacement).",
              "`#ifndef / #define / #endif` — an [[include guard||A pattern that stops a header from being included twice in one file, which would cause duplicate-definition errors. Modern alternative: `#pragma once`.]] to prevent double inclusion.",
            ]},
            {
              code:
`#ifndef MYHEADER_H      // include guard
#define MYHEADER_H

int add(int a, int b);

#endif`,
              title: "myheader.h",
            },
            { p: "Macros do blind text substitution and ignore types, so prefer `const`, `constexpr`, and `inline` functions where possible. Reserve the preprocessor for includes and guards." },
            { tip: "Modern projects often replace include guards with a single line at the top of a header: `#pragma once`. It's simpler and supported by all major compilers." },
            {
              quiz: {
                q: "What is the purpose of an include guard?",
                options: ["To speed up the program", "To prevent a header being included more than once", "To hide private members", "To allocate memory"],
                answer: 1,
                explain: "Without a guard, including the same header twice defines its contents twice, causing compile errors. The guard makes inclusion idempotent.",
              },
            },
          ],
        },
        {
          id: "files",
          eyebrow: "Module 12 · Library",
          title: "File Input / Output",
          lede: "Read from and write to files using the same stream syntax you already know.",
          blocks: [
            { p: "The `<fstream>` header gives you file streams that behave just like `cin` and `cout`. Use [[ofstream||\"Output file stream\" — open a file for writing. Use `<<` to send data into it, exactly like `cout`.]] to write and [[ifstream||\"Input file stream\" — open a file for reading. Use `>>` or `getline` to pull data out, exactly like `cin`.]] to read." },
            {
              run:
`#include <iostream>
#include <fstream>
#include <string>
using namespace std;

int main() {
  // write
  ofstream out("notes.txt");
  out << "Line one\\n" << "Line two\\n";
  out.close();

  // read back
  ifstream in("notes.txt");
  string line;
  while (getline(in, line)) cout << "Read: " << line << "\\n";
  in.close();
  return 0;
}`,
              title: "files.cpp",
            },
            { p: "This example runs inside the sandboxed container, writing to a temporary file that's discarded afterward — so it's safe to experiment." },
            { warn: "Opening a file can fail (missing file, no permission). Check it worked: `if (!in) { /* handle error */ }` before reading." },
            {
              quiz: {
                q: "Which stream type do you use to write to a file?",
                options: ["ifstream", "ofstream", "istream", "stringstream"],
                answer: 1,
                explain: "ofstream is the output file stream (o = out). ifstream is for input/reading (i = in).",
              },
            },
          ],
        },
        {
          id: "next",
          eyebrow: "You did it",
          title: "Where to Go Next",
          lede: "You've covered the full C++ language tutorial. Here's how to keep the momentum.",
          blocks: [
            { p: "Congratulations — you've worked through program structure, types, control flow, functions, arrays, pointers, dynamic memory, the full object-oriented model, templates, namespaces, exceptions, casting, the preprocessor, and file I/O. That's the entire core language." },
            { h2: "Build something" },
            { p: "The fastest way to cement this is a small project. Pick one and use the runnable editors here to prototype:" },
            { ul: [
              "A command-line to-do list (vectors + structs + file I/O).",
              "A number-guessing game (loops, conditions, input).",
              "A tiny bank with accounts (classes, encapsulation).",
              "A shape-area calculator (inheritance + polymorphism).",
            ]},
            { h2: "Deepen your knowledge" },
            { ul: [
              "Master the **STL**: `vector`, `map`, `set`, and algorithms like `sort`, `find`, `accumulate`.",
              "Learn **modern C++** features: lambdas, `auto`, range-based loops, smart pointers, move semantics.",
              "Read the reference at cplusplus.com and cppreference.com as you code.",
              "Practise on small algorithm problems to build fluency.",
            ]},
            { tip: "Keep this lab open as a scratchpad. Every editor here is a real compiler — paste in snippets, tweak them, and watch what happens. That feedback loop is how proficiency is built." },
            { p: "**Well done.** You now read and write real C++. Mark this lesson complete to finish the course at 100%." },
          ],
        },
      ],
    },
  ];

  window.CourseData = MODULES;
})();
