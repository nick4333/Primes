/*
I keep the same sytax here for clarity to the other scripts
For example I use rawBits to refer to an array of bools
*/

let process = require('process');
var sieve;

class primeSieve {
    //Initialization of properties
    rawbits = [];
    sieveSize = 0;
    
    //results dictionary stores how many primes from 1*10^1 to 1*10^10
    resultsDict = [
        [
            10, 4
        ],
        [
            100, 25
        ],
        [
            1000, 168
        ],
        [
            10000, 1229
        ],
        [
            100000, 9592
        ],
        [
            1000000, 78498
        ],
        [
            10000000, 664579
        ],
        [
            100000000, 5761455
        ],
        [
            1000000000, 50847534
        ],
        [
            10000000000, 455052511
        ],
    ]

    //contructs primeSieve object with default data
    constructor(limit){
        this.sieveSize = limit;
        this.rawbits.length = Math.floor((this.sieveSize + 1) / 2);
        for(let i = 0; i < Math.floor((this.sieveSize + 1) / 2); i++){
            this.rawbits[i] = true;
        }
    }

    //Checks if counted primes match known history up to 10,000,000,000 or 1*10^10
    validateResults(){
        for(let i = 0; i < this.resultsDict.length; i++){
            if(this.resultsDict[i][0] == this.sieveSize){
                return Number(this.resultsDict[i][1]) == this.countPrimes();
            }
        }
        return false
    }

    //returns if a number is prime or not assuming it isn't even
    getBit(index){
        if(index % 2 == 0){
            return false;
        } else{
            let temp = this.rawbits[Math.floor(index / 2)];
            return temp
        }
    }

    //sets an entry in the bool array as false if index is an odd number
    clearBit(index){
        if(index % 2 == 0){
            throw {name : "Error message: ", message : "Even number! Check your code bonehead."};
        } else{
            this.rawbits[Math.floor(index / 2)] = false;
        }
    }

    //Main logic loop that does the brunt of the work
    runSieve(){
        let factor = 3;
        let q = Math.sqrt(this.sieveSize);
        while(factor <= q){
            for(let i = factor; i < this.sieveSize; i++){
                if (i == 3){
                    for(let num = i * 3; num < this.sieveSize; num += 2 * i){
                        this.clearBit(num);
                    }
                }
                if (i != factor && this.getBit(i) == true){
                    factor = i;
                    break;
                }
            }
            for(let num = factor * 3; num < this.sieveSize; num = num + 2 * factor){
                this.clearBit(num);
            }
        }
    }

    //method that counts calculated primes from the bool array
    countPrimes(){
        let temp = 0;
        for(let i = 0; i < this.rawbits.length; i++){
            if(this.rawbits[i]){
                temp++
            }
        }
        return temp;
    }

    //prints the results and does data validation
    printResults(showResults, duration, passes){
        if(showResults){
            process.stdout.write("2, ");
        }

        let count = 1;
        for (let i = 3; i < this.sieveSize; i++){
            if(this.getBit(i) == true){
                if(showResults){
                    process.stdout.write(String(i) + ", ");
                }
                count++;
            }
        }
        if(!(count == this.countPrimes())){
            throw {name : "Error message: ", message : "Incorect number of primes counted! " + count + "\n"};
        }
        console.log("\n");
        console.log("Passes: " + String(passes) + ", Time: " + String(duration/1000) + "s, Avg: " + String(duration/passes/1000) + "s, Limit: " + String(this.sieveSize) + ", Count: " + String(count) + ", Valid: " + String(this.validateResults()));
        console.log("\n");
        console.log("davepl;" + String(passes) + ";" + String(duration) + ";1;algorithm=base,faithful=yes");
    }
}

//I encapsulated the main loop within a try and catch to generate an error
//if something went wrong
try{
    let tStart = Date.now();
    let passes = 0;

    while(Date.now() - tStart < 5000){
        sieve = new primeSieve(1000000);
        sieve.runSieve();
        passes++;
    }

    tD = Date.now() - tStart;
    sieve.printResults(false, tD, passes);
} catch(e){
    console.error(e.name + e.message);
}
