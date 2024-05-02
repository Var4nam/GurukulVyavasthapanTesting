import { LightningElement, track } from 'lwc';
export default class Testing extends LightningElement {

    @track pass;
    alphabetMap;

    connectedCallback() {
        // Initialize the map
        this.alphabetMap = new Map();

        // Fill the map with values from 'a' to 'z'
        for (let i = 1; i <= 26; i++) {
            this.alphabetMap.set(String.fromCharCode(96 + i), i);
        }

        // Print the map to see the result
        console.log(this.alphabetMap);
    }

    getPasswordValue(event) {
        var password = event.target.value;
        this.pass = password.toLowerCase();
    }

    handleSubmitClick() {
        console.log('this.pass ::: ',this.pass);

        // Initialize an array to store map values based on this.pass
        let mapValues = [];

        // Iterate over each character in this.pass
        for (let char of this.pass) {
            // Get the value from the map based on the character
            let value = this.alphabetMap.get(char);
            if (value !== undefined) {
                // If the value is found, add it to the array
                mapValues.push(value);
            } else {
                // Handle characters not found in the map (if needed)
            }
        }

        // Log the array of map values
        console.log('Map values based on this.pass:', JSON.stringify(mapValues));

        // Replace even values with "@" and odd values with "$"
        for (let i = 0; i < mapValues.length; i++) {
            if(mapValues[i] < 10) {
                if (mapValues[i] % 2 === 0) {
                    mapValues[i] = '@';
                } else {
                    mapValues[i] = '$';
                }
            } else {
                mapValues[i] = mapValues[i] + 1;
            }
        }

        // Log the modified array of map values
        console.log('Modified map values based on this.pass:', JSON.stringify(mapValues));

        // Retrieve the keys based on the modified map values
        let mapKeys = [];
        for (let value of mapValues) {
            console.log('value ::: ',value);
            if(value != '$' && value != '@') {
                for (let [key, val] of this.alphabetMap.entries()) {
                    if (val === value) {
                        mapKeys.push(key);
                        break;
                    }
                }
            } else {
                mapKeys.push(value);
            }
            
        }
        console.log('Keys corresponding to modified map values:', JSON.stringify(mapKeys));

        let keysString = mapKeys.reduce((accumulator, currentValue) => accumulator + currentValue, '');
        console.log('keysString ::: ',keysString);
        // window.alert('you code is : ' + keysString);
    }
}