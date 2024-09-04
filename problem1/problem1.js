// Implementation 1: For loop
var sum_to_n_a = function(n) {
    // initialise return variable ret
    let ret = 0;

    // loop through all numbers from 1 to n and add them to ret
    for (let i = 1; i <= n; i++) {
        ret += i;
    }

    return ret;
};

// Implementation 2: Arithmetic formula
var sum_to_n_b = function(n) {
    // return the sum of the first n natural numbers
    return n * (n + 1) / 2;
};

// Implementation 3: Recursion
var sum_to_n_c = function(n) {
    // if n is less than or equal to 1, return n
    if (n <= 1) {
        return n;
    }
    // else return the sum of the first n natural numbers
    else{
        return sum_to_n_c(n - 1) + n;
    }
};