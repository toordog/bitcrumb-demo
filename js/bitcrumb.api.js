// bitcrumb.api.js

(function(global) {

    // Define a namespace for the API
    const BitcrumbAPI = {};

    // Define a schema for storing data in localStorage
//    const SCHEMA_KEY = 'bitcrumbSchema';
    const KEY_SCHEMA = 'keys';
    const DATA_SCHEMA = 'data';
    const SIG_SCHEMA = 'sig';
    const ARTIFACT_SHEMA = 'artifact';
    
    const defaultSchema = [];
    
    // Initialize schema in localStorage if not already present
    function initializeSchema() {
    
        this.tmpIdentifier = undefined;
    
        if (!localStorage.getItem(KEY_SCHEMA)) {
            localStorage.setItem(KEY_SCHEMA, JSON.stringify(defaultSchema));
            localStorage.setItem(DATA_SCHEMA, JSON.stringify(defaultSchema));
            localStorage.setItem(SIG_SCHEMA, JSON.stringify(defaultSchema));
            localStorage.setItem(ARTIFACT_SHEMA, JSON.stringify(defaultSchema));
        }
    };
    
    BitcrumbAPI.cleanKey = function(key) {
        const pemLines = key.split("\r\n");
        const keyDataLines = pemLines.slice(1, pemLines.length - 2); // Exclude the first and last lines
        const keyData = keyDataLines.join("");
        return keyData;
    };

    BitcrumbAPI.generateKeyPair = function() {
    
        const keyPair = forge.pki.rsa.generateKeyPair({bits: 2048});
        let publicKeyPem = forge.pki.publicKeyToPem(keyPair.publicKey);
        let privateKeyPem = forge.pki.privateKeyToPem(keyPair.privateKey);
        
        const keySchema = {
            pubKey : publicKeyPem,
            privKey : privateKeyPem
        };
        
        BitcrumbAPI.createEntry(KEY_SCHEMA,keySchema);
    };

    BitcrumbAPI.verify = function(data, signature, key) {
    
        let publicKey = forge.pki.publicKeyFromPem((key) ? key : BitcrumbAPI.getPublicKey());
    
        // Verify
        var md = forge.md.sha256.create();
        md.update(data, 'utf8');
        var pss = forge.pss.create({
            md: forge.md.sha256.create(),
            mgf: forge.mgf.mgf1.create(forge.md.sha256.create()),
            saltLength: 32 // Use a reasonable salt length
        });

        // Decode the signature before verifying
        var decodedSignature = forge.util.decode64(signature);
        return publicKey.verify(md.digest().getBytes(), decodedSignature, pss);
    };

    BitcrumbAPI.sign = function(data) {

        let privateKey = forge.pki.privateKeyFromPem(BitcrumbAPI.getPrivateKey());

        // Use SHA-256 for better security
        var md = forge.md.sha256.create();
        md.update(data, 'utf8');
        var pss = forge.pss.create({
            md: forge.md.sha256.create(),
            mgf: forge.mgf.mgf1.create(forge.md.sha256.create()),
            saltLength: 32 // Use a reasonable salt length
        });

        var _signature = privateKey.sign(md, pss);

        return forge.util.encode64(_signature);
    };
    
    // old style finger prints, still useful
    BitcrumbAPI.fingerprint = function (data) {
        const md = forge.md.sha256.create();
        md.update(data, 'utf8');
        
        // Get the digest as hex
        const digest = md.digest().toHex();
        
        // Insert colons every two characters
        const colonSeparated = digest.match(/.{2}/g).join(':');
        return colonSeparated;
    };
    
    BitcrumbAPI.hash = function(data) {
        // Create a SHA-256 hash
        const md = forge.md.sha512.create();

        // Update the hash with the data
        md.update(data);

        // Get the hexadecimal representation of the hash
        const hashHex = md.digest().toHex();

        return hashHex;
    };

    // Create: Add a new entry
    BitcrumbAPI.createEntry = function(schema,entry) {

        const _schema = JSON.parse(localStorage.getItem(schema),reviveBigNumber);
        
        // later we may allow multiple bitcrumbs, but for now, no...
        //entry.id = new Date().getTime(); // Simple unique ID based on timestamp
        _schema.push(entry);
        
        const _data = JSON.stringify(_schema);
        
        localStorage.setItem(schema, _data);
        return entry;
    };
    
    BitcrumbAPI.cleanKey = function(key) {
        const pemLines = key.split("\r\n");
        const keyDataLines = pemLines.slice(1, pemLines.length - 2); // Exclude the first and last lines
        const keyData = keyDataLines.join("");
        return keyData;
    }

    BitcrumbAPI.getData = function() {
        const schema = JSON.parse(localStorage.getItem(DATA_SCHEMA),reviveBigNumber);
        
        if(!schema[0]) {
            return undefined;
        }
        
        return schema[0];
    };

    BitcrumbAPI.getSignature = function() {
        const schema = JSON.parse(localStorage.getItem(SIG_SCHEMA),reviveBigNumber);
        
        if(!schema[0]) {
            return undefined;
        }
        
        return schema[0];
    };

    BitcrumbAPI.getArtifact = function() {
        const schema = JSON.parse(localStorage.getItem(ARTIFACT_SHEMA),reviveBigNumber);
        
        if(!schema[0]) {
            return undefined;
        }
        
        return schema[0];
    };

    BitcrumbAPI.getPublicKey = function() {
        const schema = JSON.parse(localStorage.getItem(KEY_SCHEMA),reviveBigNumber);
        
        if(!schema[0]) {
            return undefined;
        }
        
        return schema[0].pubKey;
    };
    
    BitcrumbAPI.getPrivateKey = function() {
        const schema = JSON.parse(localStorage.getItem(KEY_SCHEMA),reviveBigNumber);
        
        if(!schema[0]) {
            return undefined;
        }
        
        return schema[0].privKey;
    };

    BitcrumbAPI.updateArtifact = function(artifact) {
        const schema = JSON.parse(localStorage.getItem(ARTIFACT_SCHEMA),reviveBigNumber);
        schema[0].artifact = artifact;
        localStorage.setItem(SCHEMA_KEY, JSON.stringify(schema));
    };

    BitcrumbAPI.createIdentity = function(func) {
    
        const pubKey = BitcrumbAPI.cleanKey(BitcrumbAPI.getPublicKey());

        let data = {
            pubKey: pubKey,
            test: "I will come back to this!" // we can make this anything, maybe an entry point to a recoverry sceme?
        };

        let sData = JSON.stringify(data);
        let signature = BitcrumbAPI.sign(sData);

        let wrapper = {
            body: data,
            signature: signature
        };

        return BAPI.createRequestFunction('/cp/identity/create')(wrapper, null, null, func);
    };

    class SimpleBrowserDB {
    
    }

    class RESTAPIEndpoint {

        createRequestFunction(url) {

            return function (data, identifier, newidentifier, callback) {

                var artifact = BitcrumbAPI.getArtifact();

                var xhr = new XMLHttpRequest();
                console.log(url);
//                xhr.open("POST", url, true);
                xhr.open("POST", 'http://amsterdam.home.crumbylabs.com:8888'+url, true);
//                xhr.open("POST", 'http://bitcrumb.crumbylabs.com:8888'+url, true);

                xhr.setRequestHeader("Content-Type", "application/json");
                
                if(artifact !== null) {
                    xhr.setRequestHeader("XBITCRUMB-ARTIFACT", artifact);
                }

                if (identifier !== null) {
                    xhr.setRequestHeader("XBITCRUMB-IDENTIFIER", identifier);
                }

                if (newidentifier !== null) {
                    xhr.setRequestHeader("XBITCRUMB-NEWIDENTIFIER", newidentifier);
                }

                // Capture network-related errors
                xhr.onerror = function () {
                    //alert("Network Error: The request failed.");
                };

                // Optional: Capture timeout
                xhr.ontimeout = function (e) {
                    //alert("Error: The request timed out."+e.responseText);
                };
                
                // Optional: Set a timeout for the request
                xhr.timeout = 5000; // 5 seconds
                                
                xhr.onreadystatechange = function () {

                    if (xhr.readyState === XMLHttpRequest.DONE) {

                        if (xhr.readyState === 4 && xhr.status === 200) {

                            var response = JSON.parse(xhr.responseText,reviveBigNumber);
                            
                            // XXX : working on strignify and keeping BigNumber
                            //console.log(xhr.responseText);
                            
                            const _sig = response.signature;
                            const _serverPubKey = response.body.pubKey;
                            const _data = JSON.stringify(JSON.parse(xhr.responseText).body)
                            const _valid = BitcrumbAPI.verify(_data,_sig,_serverPubKey);
                            
                            if(_valid) {

                                const bitcrumbArtifact = xhr.getResponseHeader('XBITCRUMB-ARTIFACT');
                                const bitcrumbDefaultIdentifier = xhr.getResponseHeader('XBITCRUMB-IDENTIFIER');
                                
                                BitcrumbAPI.createEntry(ARTIFACT_SHEMA,bitcrumbArtifact);
                                BitcrumbAPI.createEntry(DATA_SCHEMA,response.body);
                                BitcrumbAPI.createEntry(SIG_SCHEMA,response.signature);
                                
                                if (bitcrumbDefaultIdentifier) {
                                    BitcrumbAPI.tmpIdentifier = bitcrumbDefaultIdentifier;
                                }
                                
                            } else {
                                // we have a problem!
                                console.log('oops');
                                return;
                            }
                            
                            
                            
                            
//                            console.log(bitcrumbDefaultIdentifier);
//                            console.log(atob(bitcrumbDefaultIdentifier));
                            
                            

                            //bitcrumb.storeData(localStorageKey, bitcrumbArtifact);

//                            console.log(xhr.responseText);

                            

                            
//                            var proofResponse = JSON.parse(JSON.stringify(response.body.zkp),reviveBigInt);
                                                        
//                            console.log(proofResponse);
                            
//                            var body = JSON.stringify(response.body);
                            
//                            console.log(body);
                            
                            var sig = response.signature;

                            if (response.body.pubKey) {
                                //bitcrumb.storeData(localStorageKey + '.keys.bitcrumbPubKey', response.body.pubKey);
                            }

//                            alert(JSON.stringify(response));

//                            let publicKey = forge.pki.publicKeyFromPem(BitcrumbAPI.getPublicKey());
//                            let validDoc = BitcrumbAPI.verify(body, sig, publicKey);

                            //console.log(response);

//                            if (!validDoc) {
//                                callback("Signature did not validate: ", null);
//                            }

                            callback(null, response);
                        } else {
                            callback("Request failed with status: " + xhr.status, null);
                        }
                    }

                };

                var jsonData = JSON.stringify(data);
                xhr.send(jsonData);
            };

        }
    }

    BigNumber.prototype.toJSON = function() {
        return this.toFixed();
    };

    // Custom reviver function to convert large numbers to BigInt
    function reviveBigNumber(key, value) {
        if (/^\d+$/.test(value)) {
            // Check if the string is a large number and convert it to BigInt
            return new BigNumber(value);
        }
        return value;  // Return other values unchanged
    }
        
    // Initialize the schema on first load
    initializeSchema();
    
    // Expose the API to the global object (window)
    global.BitcrumbAPI = BitcrumbAPI;
    
    const BAPI = new RESTAPIEndpoint('http://localhost:8888');

})(window);

