// ToDo: will add DF556 nb-iot support in near future
// Import JSON module
// const JSON = require('circular-json');
const utility = require('./utility');
class df {

    static parse_data_DF556(req_data) {


        let originalString = req_data;
        let charactersToRemove = 10; // Number of characters to remove from the right
        let newString = originalString.substr(0, originalString.length - charactersToRemove);
        req_data=newString
        console.log(req_data);
        try {
            const data_type = req_data.substring(6, 8);
            const data_len = parseInt(req_data.substring(8, 10), 16);

            let attr_result = '';
            let token_id = '';
            if (data_len === req_data.length / 2) {
                let attribute = {};

                if (data_type === '01' || data_type === '02') {
                    if (data_len === 30) {
                        token_id = req_data.substring(43, 58);
                        const data_height = parseInt(req_data.substring(10, 14), 16);
                        const data_gps_enabled = parseInt(req_data.substring(14, 16), 16);
                        const data_empty_alarm = parseInt(req_data.substring(22, 23), 16);
                        const data_battery_alarm = parseInt(req_data.substring(25, 26), 16);
                        const data_volt = parseInt(req_data.substring(26, 30), 16) / 100;
                        const data_rsrp_origin = req_data.substring(30, 38);
                        const data_rsrp =0// parseFloat(utility.hexToFloat(data_rsrp_origin));
                        const data_frame_counter = parseInt(req_data.substring(54, 58), 16);

                        attribute = {
                            "height": data_height,
                            "gps_enabled": data_gps_enabled,
                            "empty_alarm": data_empty_alarm,
                            "battery_alarm": data_battery_alarm,
                            "volt": data_volt,
                            "rsrp": data_rsrp,
                            "frame_counter": data_frame_counter
                        };
                    } else if (data_len === 38) {
                        token_id = req_data.substring(59, 74);
                        const data_height = parseInt(req_data.substring(10, 14), 16);
                        const data_gps_enabled = parseInt(req_data.substring(14, 16), 16);
                        const data_longitude_origin = req_data.substring(16, 24);
                        const data_longitude = parseFloat(utility.IEEE754_Hex_To_Float(data_longitude_origin)).toFixed(6);
                        const data_latitude_origin = req_data.substring(24, 32);
                        const data_latitude = parseFloat(utility.IEEE754_Hex_To_Float(data_latitude_origin)).toFixed(6);
                        const data_empty_alarm = parseInt(req_data.substring(38, 39), 16);
                        const data_battery_alarm = parseInt(req_data.substring(41, 42), 16);
                        const data_volt = parseInt(req_data.substring(42, 46), 16) / 100;
                        const data_rsrp_origin = req_data.substring(46, 54);
                        const data_rsrp = parseFloat(utility.IEEE754_Hex_To_Float(data_rsrp_origin));
                        const data_frame_counter = parseInt(req_data.substring(70, 74), 16);

                        attribute = {
                            "height": data_height,
                            "gps_enabled": data_gps_enabled,
                            "longitude": data_longitude,
                            "latitude": data_latitude,
                            "empty_alarm": data_empty_alarm,
                            "battery_alarm": data_battery_alarm,
                            "volt": data_volt,
                            "rsrp": data_rsrp,
                            "frame_counter": data_frame_counter
                        };
                    }
                } else {
                    if (data_len === 32) {
                        token_id = req_data.substring(data_len * 2 - 17, -2);
                        const data_firmware_version = `${parseInt(req_data.substring(10, 12), 16)}.${parseInt(req_data.substring(12, 14), 16)}`;
                        const data_upload_interval = parseInt(req_data.substring(14, 18), 16);
                        const data_detect_interval = parseInt(req_data.substring(18, 20), 16);
                        const data_height_threshold = parseInt(req_data.substring(20, 22), 16);
                        const data_battery_threshold = parseInt(req_data.substring(26, 28), 16);
                        const data_imsi = req_data.substring(29, 44);
                        const data_work_mode = parseInt(req_data.substring(44, 46), 16);

                        attribute = {
                            "firmware_version": data_firmware_version,
                            "upload_interval": data_upload_interval,
                            "detect_interval": data_detect_interval,
                            "height_threshold": data_height_threshold,
                            "battery_threshold": data_battery_threshold,
                            "imsi": data_imsi,
                            "work_mode": data_work_mode
                        };
                    }
                }
                attr_result = JSON.stringify(attribute);
            } else {
                attr_result = JSON.stringify("");
                token_id = "";
            }
            //time.sleep(1);
           
            return [attr_result, token_id];
        } catch (e) {
            console.error(e);
        }
    }
}
    //module.exports.myFunction = function() { parse_data_DF556 }
    module.exports={df}


// // Example usage:
// //const reqData = "80 00 16 02 1E 0265 00 00 0000 0000 0168 008045C4 1865385060029872 0001 81";
// const [attrResult, tokenId] = DF556.parse_data_DF556('800016021e0013000000001000016a008022c40001186165806254875881ffffffffff');
// console.log("attrResult:", attrResult);

// console.log("tokenId:", tokenId);
