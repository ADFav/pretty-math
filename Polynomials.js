function polynomial() {
    this.terms = {};
    this.roots = [];
    this.degree = 0;

    this.add          = function(p) {
        var result = new polynomial();
        result.terms = p.terms;
        for (var term in this.terms) {
            term in result.terms ? result.terms[term] += this.terms[term] : result.terms[term] = this.terms[term];
        }
        for (term in result.terms) {
            if (result.terms[term] == 0) {
                delete result.terms[term];
            }
            result.degree = result.terms == {} ? 0 : Object.keys(result.terms).reduce(function(a, b) { return (a > b ? a : b) }, 0);
        }
        return result;
    };         // add
    this.subtract     = function(p) { 
        return this.add(p.multiply(Polynomial_From_Terms({ 0: -1 }))); 
        
    };         // subtract
    this.multiply     = function(p) {
        var result = new polynomial();
        for (var p_term in p.terms) {
            for (var q_term in this.terms) {
                var term_index = 1 * q_term + 1 * p_term;
                term_index in result.terms ? result.terms[term_index] += this.terms[q_term] * p.terms[p_term] : result.terms[term_index] = this.terms[q_term] * p.terms[p_term];
            }
        }
        result.degree = this.degree + p.degree;
        for (var root in this.roots) {
            result.roots.push(root);
        }
        for (var root in p.roots) {
            result.roots.push(root);
        }
        return result;
    };         // multiply
    this.divide       = function(p) {
        var q = Polynomial_From_Terms({}),
            r = this;
        while (r.degree >= p.degree && q.degree <= 10) {
            q = q.add(Polynomial_From_Terms({
                [r.degree - p.degree]: r.terms[r.degree] / p.terms[p.degree] }));
            r = this.subtract(p.multiply(q));
        }
        return { "quotient": Polynomial_From_Terms(q.terms), "remainder": r };
    };         // divide
    this.derivative   = function() {
        var result = new polynomial();
        for (var term in this.terms) {
            if (term != 0) {
                result.terms[term - 1] = term * this.terms[term];
            }
        }
        return result;
    };          // derivative
    this.evaluate     = function(x) {
        var result = 0;
        for (var term in this.terms) {
            result += Math.pow(x, term) * this.terms[term];
        }
        return result;
    };         // evaluate
    this.findRoot     = function(guess = 0) {
        var d = this.derivative();
        var result = this.evaluate(guess);
        while (Math.abs(result) > 0.00001) {
            if (d.evaluate(guess) == 0) {
                guess += 0.1;
            }
            guess = guess - this.evaluate(guess) / d.evaluate(guess);
            result = this.evaluate(guess);

        }
        return guess;
    }; // find-root
    this.findAllRoots = function() {
        var result = [];
        var r = this;
        while (r.degree > 0) {
            var root = r.findRoot(1);
            result.push(root);
            console.log(root);
            r = r.divide(Polynomial_From_Roots([root])).quotient;
            console.log(r.toString());
        }
        this.roots = result;
        return result;
    };          // find-all-roots
    this.toString     = function() {
        var result = "";
        for (var term = this.degree; term >= 0; term--) {
            if (this.terms[term] && this.terms[term] != 0) {
                if (term == this.degree) {
                    result += (this.terms[term] > 0 ? "" : "-");
                }
                else {
                    result += (this.terms[term] > 0 ? " + " : " - ");
                }
                if (Math.abs(this.terms[term]) != 1) { result += Math.abs(this.terms[term]); }
                if (term >= 1) { result += "x"; }
                if (term > 1) { result += sup(term); }
                if (term == 0 && Math.abs(this.terms[term]) == 1) { result += Math.abs(this.terms[term]); }
            }
        }
        return result;
    };
} // polynomial-class	

function Polynomial_From_Terms(terms) {
    var result = new polynomial();
    result.terms = terms;
    for (var term in result.terms) {
        if (result.terms[term] == 0) {
            delete result.terms[term];
        }
    }
    result.degree = parseInt(Object.keys(result.terms).reduce(function(a, b) { return (a > b ? a : b) }, 0));
    return result;
}

function Symmetric_Function(nums, order) {
    if (order == 0) { return 1; }
    if (order == 1) { return nums.reduce(function(a, b) { return a + b; }); }
    if (order > 1) {
        var result = 0;
        for (var i = 0; i < nums.length; i++) {
            if (i < nums.length) {
                var remaining_arguments = nums.slice(i + 1);
                if (remaining_arguments.length >= order - 1) {
                    result += nums[i] * Symmetric_Function(remaining_arguments, order - 1);
                }
            }
        }
        return result;
    }
    return -1;
}

function Polynomial_From_Roots(roots, LC = 1) {
    var result = new polynomial();
    result.roots = roots;
    var terms = {};
    var sign = 1;
    for (var i = 0; i <= roots.length; i++) {
        var coeff = LC * sign * Symmetric_Function(roots, i);
        if (coeff != 0) {
            terms[roots.length - i] = coeff;
        }
        sign *= -1;
    }
    result.terms = terms;
    result.degree = roots.length;
    return result;
}

function sup(x) {
    if (String(x).length > 1) {
        return String(x).split("").map(sup).join("");
    }
    return { "0:": "⁰", "1": "¹", "2": "²", "3": "³", "4": "⁴", "5": "⁵", "6": "⁶", "7": "⁷", "8": "⁸", "9": "⁹", "+": "⁺", "-": "⁻", "=": "⁼", "(": "⁽", ")": "⁾", "n": "ⁿ", "i": "ⁱ" }[String(x)];
}

function sub(x) {
    if (String(x).length > 1) {
        return String(x).split("").map(sub).join("");
    }
    console.log({ "0:": "₀", "1": "₁", "2": "₂", "3": "₃", "4": "₄", "5": "₅", "6": "₆", "7": "₇", "8": "₈", "9": "₉", "+": "₊", "-": "₋", "=": "₌", "(": "₍", ")": "₎" }[String(x)]);
}


var f = Polynomial_From_Terms({ 3: 1, 2: 1, 1: 1, 0: 1 });
var g = Polynomial_From_Roots([1, 2]);

console.log(f.toString());
console.log(g.toString());
console.log(f.multiply(g).toString());
console.log(f.multiply(g).findAllRoots());