const net = require('net');
const http = require('http');
const Logger = require('./Logger'); // Replace './Logger' with the actual path to your Logger module
const df556 =require('./df556');
const port_number = 9500;
const max_clients = 10;
let attr_result = "";
let token_id = "";
const host="www.bkstsl.dzkimtech.com"//"localhost"
const axios = require('axios');
function uploadData2(attr, token) {
    try {
        console.log("try to upload data");
        const str_url = "https://bkstsl.dzkimtech.com/JaugToBDD"; // Adjust the path as needed
        const len_attr = attr.length;

        const headers = {
            "User-Agent": "curl/7.55.1",
            "Accept-Language": "*/*",
            "Content-Type": "application/json",
            "Authorization": token,
            "Content-Length": len_attr.toString(),
        };

        const options = {
           // hostname: "bkstsl.dzkimtech.com", // Update the host
          // port: 3500, // Default port for HTTP
            path: str_url,
            method: "POST",
            headers: headers,
        };

        const req = http.request(options, (res) => {
            console.log("response is " + res.statusCode);
            // Handle the response as needed
        });

        req.on('error', (error) => {
            console.error(error);
            // Handle the error as needed
        });

        req.write(attr);
        req.end();
    } catch (ex) {
        console.log(ex);
        // Handle the exception as needed
    }
}



function uploadData(attr, token) {
    try {
        console.log("try to upload data");
        const str_url = "http://bkstsl.dzkimtech.com/JaugToBDD"; // Update the URL
        const headers = {
            "User-Agent": "curl/7.55.1",
            "Accept-Language": "*/*",
            "Content-Type": "application/json",
            "Authorization": token,
        };

        axios.post(str_url, attr, {
            headers: headers,
        })
        .then((response) => {
            console.log("response is " + response.status);
            

            // Handle the response as needed
        })
        .catch((error) => {
            console.error(error);
            // Handle the error as needed
        });
    } catch (ex) {
        console.log(ex);
        // Handle the exception as needed
    }
}

function responseSensor(client, data) {
    try {
        client.write(data, 'utf-8');
    } catch (ex) {
        console.error(ex);
        // log.logger.exception(ex);
    }
}

function handleClient(client) {
  
    try {
        client.setTimeout(10000); // 10 seconds timeout
        let requestBytes = Buffer.from([]);
        let attrResult = "";
        let tokenId = "";

        client.on('data', (data) => {
            requestBytes = Buffer.concat([requestBytes, data]);
            const requestStr = requestBytes.toString('hex');
            const findResult1 = requestStr.indexOf("8000");
            if (findResult1 !== -1) {
                const strSubReq = requestStr.substring(findResult1);
                const dataType = strSubReq.substring(4, 6);
                // log.logger.debug(`packet is ${strSubReq}, data_type is DF${dataType}0`);
                if (dataType === "01") {
                    [attrResult, tokenId] = df702.parseDataDF702(strSubReq.trim().toUpperCase());
                }
                 else if (dataType === "16") {
                    
                    console.log( "1--------",strSubReq.trim().toUpperCase());
                    [attrResult, tokenId] = df556.df.parse_data_DF556(strSubReq.trim().toUpperCase());
                }
                
                console.log(`attr___ is ${attrResult}, token_id is____ ${tokenId}`);
                // log.logger.debug(`attr is ${attrResult}, token_id is ${tokenId}`);
                
                if (attrResult !== "" && tokenId !== "") {
                    uploadData(attrResult, tokenId);
                    // log.logger.debug("after upload data ");

                   
                        try {
                            client.write("8002999901003C81", 'utf-8');
                        } catch (ex) {
                            console.error("*************************************************",ex);
                            // log.logger.exception(ex);
                        }
                   


                } else {
                    // log.logger.debug("invalid data ");
                }
                
                setTimeout(() => {
                    client.end();
                }, 1000);
                
                // log.logger.debug("close device connection");
            }
        });

        client.on('timeout', () => {
            console.log("timeout");
            client.end();
        });
    } catch (error) {
        console.error(error);
        // log.logger.error(error);
    }
}


const server = net.createServer((client) => {
    console.log('connected');
    console.log(`${client.remoteAddress}:${client.remotePort} connected!`);
    //log.logger.debug(`${client.remoteAddress}:${client.remotePort} connected!`);
    handleClient(client);
 

   // broadcastMessage("slem likoulm")
});
server.listen(port_number, '0.0.0.0', () => {
   console.log(`Server listening on port ${port_number}`);
   // log.logger.debug(`Server listening on port ${port_number}`);
});

server.on('error', (error) => {
    console.error(error);
    
    // log.logger.error(error);
});


// // Function to broadcast a message to all connected clients
// function broadcastMessage(message) {
//     clients.forEach((client) => {
//       client.write(8002999901003C81);
//     });
//   }


 
