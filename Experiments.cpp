#include <iostream>
using namespace std;

int num = 10;

int add(int& a) {
    return a + 1;
}

int main() {
    cout << add(num) << endl <<\
    "[" << sizeof(num) << "]" << " <-- int size"
    "[" << sizeof(float) << "]" << " <-- float size"  << endl <<
    "[" << sizeof(bool) << "]" << " <-- bool size"  << endl <<
    "[" << sizeof(double) << "]" << " <-- double size";
    return 0;
}